import { AppApi } from './components/base/AppApi';
import { Api, IApi } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import { BasketCard } from './components/BasketCard';
import { BasketData } from './components/BasketData';
import { Modal } from './components/common/Modal';
import { FormModal } from './components/common/FormModal';
import { MainPage } from './components/MainPage';
import { OrderData } from './components/OrderData';
import { ProductCard } from './components/ProductCard';
import { ProductsData } from './components/ProductsData';
import { SuccessModal } from './components/SuccessModal';
import './scss/styles.scss';
import { IOrder, TContactsInfo, TOrderInfo } from './types';
import { API_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';

// Обработчик событий
const events: IEvents = new EventEmitter();

// Для обмена с сервером
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);


/* Элементы, хранящие данные */

// Список товаров (данные)
const productsData = new ProductsData(events);

// Корзина (данные)
const basketData = new BasketData(events);

// Данные пользователя (данные)
const orderData = new OrderData(events);


/* Темплейты */

// Темплейт карточки сообщающей об успешной покупке
const cardSuccess: HTMLTemplateElement = document.querySelector('#success');

// Элемент карточки, сообщающей об успешной покупке
const modalSuccess = new SuccessModal(cloneTemplate(cardSuccess), events);

// Темплэйт карточки товара для отображения на основной странице сайте
const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');

// Темплэйт карточки товара для отображения в корзине
const basketCardTemplate: HTMLTemplateElement = document.querySelector('#card-basket');

// Темплэйт карточки товара для отображения в модальном окне
const modalCardTemplate: HTMLTemplateElement = document.querySelector('#card-preview');

// Темплейт формы для ввода информации о заказе
const orderFormTemplate: HTMLTemplateElement = document.querySelector('#order');

// Темплейт формы для ввода контактной информации
const contactsFormTamplate: HTMLTemplateElement = document.querySelector('#contacts');

// Темплэйт корзины
const modalBasketTemplate: HTMLTemplateElement = document.querySelector('#basket');


/* Элементы, отвечающие за отображение */

// Основная страница
const mainPage = new MainPage(document.body, events);

// Модальное окно (глобальное)
const modal = new Modal(document.querySelector('#modal-container'), events);

// Форма для ввода информации о заказе
const modalWithOrder = new FormModal(cloneTemplate(orderFormTemplate), events);

// Форма для ввода контактной информации
const modalWithContacts = new FormModal(cloneTemplate(contactsFormTamplate), events);

// Корзина (отображение)
const modalWithBasket = new BasketCard(cloneTemplate(modalBasketTemplate), events);


/* Обмен с сервером */

// Получаем карточки с сервера
Promise.all([api.getProducts(), api.getProductsNumber()])
	.then(([initialCards, initialTotal]) => {
      productsData.products = initialCards;
      productsData.totalNumber = initialTotal;
			events.emit('initialData: loaded');
	})
	.catch((err) => {
		console.error(err);
	});

/* Отправляет информацию о заказе на сервер (обработчик события) */
	events.on('contacts:submit', () => {
		api.setInfo(orderData.order)
		 .then((res) => {
			console.log(res);
			events.emit('order:success');
			basketData.clearBasket();
			orderData.closeOrder();
			productsData.baketInfoReset();
		 })
		 .catch((err) => {
			 console.log(err)
		 })
	});


// Обработчики событий

// Открывает корзину (событие)
events.on('basket:open', () => {
	events.emit('basket:update');
	modal.content = modalWithBasket.render();
	modal.render({catalog: modalWithBasket});
})

// Обновляет информацию в корзине (событие)
events.on('basket:update', () => {
	let i = 1;
	const cardsArray = basketData.basket.products.map(product => {
		const newProductCard = new ProductCard(cloneTemplate(basketCardTemplate), events);
		newProductCard.itemNumber = i;
		i++;
		return newProductCard.render(product);
	});

	modalWithBasket.content = cardsArray;

	basketData.calculateTotalPrice();
	modalWithBasket.total = basketData.total;

	modalWithBasket.changeButtonActivity(basketData.basket.products.length);
})

// Выводит карточки на страницу (событие)
events.on('initialData: loaded', () => {
	const cardsArray = productsData.products.map(product => {
		const newProductCard = new ProductCard(cloneTemplate(cardTemplate), events);
		return newProductCard.render(product);
	});
	mainPage.render({catalog: cardsArray});
});

// Открывает попап с быбранным товаром (событие)
events.on('product:select', (data: {productId: string}) => {
	const {productId} = data;
	const modalWithProduct = new ProductCard(cloneTemplate(modalCardTemplate), events);
	modalWithProduct.changeButtonActivity(productsData.getProduct(productId).inBasket);
	modal.content = modalWithProduct.render(productsData.getProduct(productId));
	modal.render({catalog: modalWithProduct});
})

// Добавляет товар к корзину (событие)
events.on('product:add', (data: {product: ProductCard}) => {
	const {product} = data;
	basketData.addProduct(productsData.getProduct(product.id));
	productsData.getProduct(product.id).inBasket = true;
	product.changeButtonActivity(productsData.getProduct(product.id).inBasket);
	events.emit('basket:update');
})

// Удаляет товар из корзины (событие)
events.on('product:delete', (data: {product: ProductCard}) => {
	const {product} = data;
	basketData.deleteProduct(product.id);
	productsData.getProduct(product.id).inBasket = false;
	product.changeButtonActivity(productsData.getProduct(product.id).inBasket);
	events.emit('basket:update');
})

// Изменяет отображение корзины (событие)
events.on('productsInBasket:changed', () => {
	const numberOfProducts = basketData.productsNumber;
	mainPage.numberOfProducts = numberOfProducts;
});

// Открывает модальное окно с формой заказа
events.on('basket:placeOrder', () => {
	orderData.items = basketData.items;
	orderData.total = basketData.total;
	modal.content = modalWithOrder.render();
	modal.render({catalog: modalWithOrder});
});

// Изменяет состояние валидации формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	modalWithContacts.valid = !email && !phone;
	modalWithContacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменяет состояние валидации формы заказа
events.on('orderFormErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;
	modalWithOrder.valid = !payment && !address;
	modalWithOrder.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});
	
// Следит за изменением одного из полей в форме контактов
events.on('contacts:change', (data: { field: keyof TContactsInfo, value: string }) => {
	orderData.setContactsInfo(data.field, data.value);
});

// Следит за изменением одного из полей в форме заказа
events.on('order:change', (data: { field: keyof TOrderInfo, value: string }) => {
	orderData.setOrderInfo(data.field, data.value);
});

// Устанавливает способ оплаты
events.on('payment:choose', (button: HTMLButtonElement) => {
	orderData.setOrderInfo('payment', button.name);
});

// Переходит от формы заказа к форме контактов
events.on('order:submit', () => {
	modal.content = modalWithContacts.render();
	modal.render({catalog: modalWithContacts});
});

// Открывает окно успешной покупки
events.on('order:success', () => {
	modalSuccess.total = orderData.order.total;
	modal.content = modalSuccess.render();
	modal.render({catalog: modalSuccess});
})

// Закрывает окно успешной покупки
events.on('success:close', () => {
	modal.closePopup();
});

// Блокирует прокрутку страницы при открытии модального окна
events.on('modal:open', () => {
	mainPage.locked = true;
});

// Снимает бблокировку прокрутки страницы при закрытии модального окна
events.on('modal:close', () => {
	mainPage.locked = false;
	orderData.closeOrder();
});