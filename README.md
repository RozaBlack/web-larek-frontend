# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемых в приложении

### Интерфейсы

Интерфейс, описывающий карточку товара
```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

Интерфейс, описывающий товары в корзине
```
interface IBasket {
  products: IProduct[] | undefined;
}
```

Интерфейс, описывающий данные, содержащиеся в заказе товара
```
interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```

Интерфейс, описывающий список товаров

```
export interface IProductsData {
  totalNumber: number;
  products: IProduct[];
  preview: string | null;
  getProduct(productId: string): IProduct;
  addInBasketInfo(): void;
  baketInfoReset(): void;
}
```

Интерфейс, описывающий корзину с товарами
```
export interface IBasketData {
  basket: IBasket;
  items: string[];
  productsNumber: number | null;
  total: number | null;
  calculateTotalPrice(): void;
  addProduct(product: IProduct): void;
  deleteProduct(productId: string): void;
  clearBasket(): void;
}
```

Интерфейс, описывающий данные, необходимые для заказа товаров
```
export interface IOrderData {
  order: IOrder;
  setOrderInfo(field: keyof TOrderInfo, value: string): void;
  setContactsInfo(field: keyof TContactsInfo, value: string): void;
  checkContactsInfo(): boolean;
  checkOrderInfo(): boolean;
  closeOrder(): void;
}
```

Интерфейс, описывающий состояние форм
```
export interface IFormModal {
  valid: boolean;
  inputValues: Record<string, string>;
  errors: string[];
}
```

Интерфейс, описывающий главную страницу
``` 
export interface IMainPage {
  numberOfProducts: number;
  catalog: HTMLElement[];
  locked: boolean;
};
```

Интерфейс, описывающий окно успешного оформления заказа
```
export interface ISuccess {
    total: number;
  }
```

Интерфейс, описывающий ответ сервера в случае успешной отправки данных
```
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};
```

Интерфейс, описывающий обмен с сервером
```
export interface IApi  {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

### Типы данных

Тип, описывающий ошибки валидации форм

```
export type TFormErrors = Partial<Record<keyof IOrder, string>>;
```

Тип, описывающий данные о заказе, вводимые в форму

```
export type TOrderInfo =  Partial<Record<keyof Pick<IOrder, 'payment' | 'address'>, string>>;
```

Тип, описывающий контактные данные, вводимые в форму

```
export type TContactsInfo = Partial<Record<keyof Pick<IOrder, 'email' | 'phone'>, string>>;
```

Типы, описывающие возможные категории товаров

```
export type TProductCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';
export type TProductCategoryMap = {[Key in 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка']: string};
```

Тип, описывающий возможные методы общения с сервером
```
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```



## Архитектура приложения

Приложение орниавано в соответствии с парадигмой MVP и разделено на следующие слои:
- слой представления, отвечающий за отображение данных на странице,
- слой данных, отвечающий за хранение и отображение данных,
- презентер, отвечающий за связь представления и данных.

### Базовый код

#### Класс Api
Реализация логики работы с сервером.\
Конструктор класса принимает базовый адрес сервера и опциональный объект с заголовками запросов.\

Методы класса:
- handleResponse(response: Response): Promise<object> - обрабатывает ответ сервера
- get(uri: string) - принимает изменяющеюся часть url-адреса, возвращает ответ от сервера
- post(uri: string, data: object, method: ApiPostMethods = 'POST') - принимает изменяющеюся часть url-адреса

#### Класс ApiApi
Отвечает за получение товаров с сервера и отправку на него информации о заказе.\
Конструктор принимает элемент класса Api.\

Методы класса:
- getProducts(): Promise<IProduct[]> - получает список товаров с сервера
- getProductsNumber(): Promise<number> - получает количество товаров с сервера
- setInfo(data: IOrder): Promise<IOrder> - передает информацию о заказе на сервер

#### Класс EventEmitter
Выступает в роли брокера событий, а также в роли Представителя (Presentor) в принципе MVP. Позволяет отправлять и подписываться на события.\

Методы класса:
- on<T extends object>(eventName: EventName, callback: (event: T) => void) - подписывает на событие
- off(eventName: EventName, callback: Subscriber) - отписывает от события
- emit<T extends object>(eventName: string, data?: T) - уведомляет подписчиков о наступлении события
- onAll(callback: (event: EmitterEvent) => void) - подписывает на все события
- offAll() - сбрасывает всех подписчиков
- trigger<T extends object>(eventName: string, context?: Partial<T>) - создает событие с заданными аргументами

### Слой данных

#### ProductsData
Класс отвечает за хранение и логику работы с карточками товаров, полученными с сервера.\
Конструктор класса принимает экземпляр класса брокера событий\
В полях класса хранятся следующие данные:
- _totalNumber: number; - количество товаров (полное)
- _products: IProduct[]; - список товаров
- _preview: string | null; - id товара, выбранного для просмотра в модальном окне
- events: IEvents; - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- addInBasketInfo(): void - отмечает товары, добавленные в корзину
- baketInfoReset(): void - сбрасывает информацию о товарах в корзине
- getProduct(productId: string): IProduct - возвращает товар по его id
- так же есть сетторы и гетторы для сохранения и получения данных полей класса

#### BasketData
Класс отвечает за хранение и логику работы с корзиной, содержащей список товаров к покупке.\
Конструктор класса принимает экземпляр класса брокера событий\
В полях класса хранятся следующие данные:
- _basket: IBasket; - список товаров в корзине
- events: IEvents; - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- _total: number; - суммарная стоимость товаров в корзине

Так же класс предоставляет набор методов для взаимодействия с данными:
- calculateTotalPrice(products: IProduct[]): void; - рассчитывает суммарную стоимость товаров в корзине
- addProduct(product: IProduct): void; - добавляет товар в корзину
- deleteProduct(productId: string): void; - удаляет товар из корзины
- clearBasket(): void; - отчищает корзину (удаляет все товары)
- так же есть сетторы и гетторы для сохранения и получения данных полей класса

#### OrderData
Класс отвечает за хранение и логику работы с информацией о заказе.\
Конструктор класса принимает экземпляр класса брокера событий\
В полях класса хранятся следующие данные:
- event: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- _order: IOrder; - информация, содержащаяся в заказе: способ оплаты товаров, электронная почта и номер телефона пользователя, адрес доставки и список покупаемых товаров
- formErrors: TFormErrors; - ошибки валидации форм с данными

Так же класс предоставляет набор методов для взаимодействия с данными:
- setOrderInfo(field: keyof TOrderInfo, value: string): void; - принимает и сохраняет данные заказа, введенные пользователем (способ оплаты и адрес)
- setContactsInfo(field: keyof TContactsInfo, value: string): void; - принимает и сохраняет данные заказа, введенные пользователем (номер телефона и почту)
- closeOrder(): void; - удаляет данные заказа
- checkContactsInfo(): boolean; - проверяет правильность контактных данных, введенных в форму
- checkOrderInfo(): boolean; - проверяет правильность данных о заказе, введенных в форму

### Классы представления

#### Абстрактный класс Component<T>
Конструктор класса принимает радительский элемент.\
Методы класса:
  render(data?: Partial<T>): HTMLElement - возвращает корневой DOM-элемент


#### Класс MainPageView
Отвечает за отображение всех карточек товара на главной странице сайта, а также кнопки корзины и информации о количестве товаров в корзине. Наследует классу Component.\
Конструктор класса принимает DOM элемент страницы и экземпляр класса `EventEmitter` для инициации событий.\
Поля класса:
- basketOpenButton: HTMLButtonElement; - кнопка для открытия модального окна корзины
- basketCounter: HTMLElement; - элемент, отображающий количество товаров в корзине
- gallery: HTMLElement; - элемент, содержащий карточки товаров
- wrapper: HTMLElement; - элемент, отвечающий за прокрутку страницы

Методы:
Класс содержит сеттеры для получения и отображения элементов интерфейса IMainPage

#### Класс Modal
Реализует модальное окно и предоставляет методы `openPopup` и `closePopup` для открытия и закрытия модального окна. Устанавливает слушатели событий на Esc на клавиатуре и клики на оверлей и кнопку-крестик для закрытия попапа.\
Конструктор класса принимает DOM-элемент модального окна и экземпляр класса `EventEmitter` для инициации событий.\
Поля класса:
- modal: HTMLElement - элемент модального окна
- event: IEvents - экземпляр класса `EventEmitter` для инициации событий.
Методы класса:
- set content(product: HTMLElement): void - выводит в окно переданный элемен разметки
- openPopup(): void; - открывает модальное окно
- closePopup(): void; - закрывает модальное окно
- closePopupEsc(evt: KeyboardEvent): void; - закрывает модальное окно нажатием на Esc
- closePopupOverlay(evt: MouseEvent): void; - закрывает модальное окно нажатием на оверлей
- render(data: Partial<T>): HTMLElement; - возвращает DOM-элемент

#### Класс FormModal
Предназначен для реализации модального окна с формой содержащей поля ввода. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы и открывает следующующее модальное окно. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.\
Конструктор, принимает клонированный шаблон темплейта.\
Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- formErrors: HTMLFormElement - поле для вывода ошибок валидации формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- inputButtons: NodeListOf<HTMLButtonElement> - коллекция кнопок для выбора способа оплаты на форме
Методы класса:
- set inputValues(data: Record<string, string>): void - получает данные, введенные в форму
- set valid(isValid: boolean): void - делает кнопку подтверждения активной/неактивной в зависимости от правильности запосления формы
- set errors(value: string): void - отображает текст ошибок валидации
- showSelectedPayment(selectedButton: HTMLButtonElement): void - выделяет кнопку с выбранным способом оплаты

#### Класс BasketCard
Отвечает за отображение корзины с товарами. Класс отображает нумерованный список с элементами в корзине, а также отображает их суммарную стоимость.\
В конструктор класса передается клонированный шаблон темплейта корзины. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Конструктор принимает клонированный шаблон темплейта и экземпляр `EventEmitter` для инициации событий.\
Поля класса:
- events: IEvents; - экземпляр класса `EventEmitter` для инициации событий
- basketList: HTMLElement; - элемент для отображения списка товаро в корзине
- createOrderButton: HTMLButtonElement; - кнопка для оформления заказа
- basketPrice: HTMLElement; - элемент в котором отображается суммарная стоимость элементов в корзине
Методы:
  set content(product: HTMLElement[]): void - отображает товары в корзине
- set total(price: number): void - отображает суммарную стоимость товаров в корзине
- changeButtonActivity(numberOfProducts: number): void - делает кнопку оформления заказа активной/не активной в зависимости от наличия товаров в корзине

#### Класс ProductCard
Отвечает за отображение карточки товара.\
Конструктор, принимает клонированный шаблон темплейта и экземпляр `EventEmitter` для инициации событий.\
Поля класса:
- events: IEvents; - экземпляр класса `EventEmitter` для инициации событий
- cardCategory: HTMLElement; - элемент, отображающий категорию товара
- cardTitle: HTMLElement; - элемент, отображающий название товара
- cardImage: HTMLImageElement; - элемент, отображающий изображение товара
- cardPrice: HTMLElement; - элемент, отображающий цену товара
- cardText: HTMLElement; - элемент, отображающий информацию о товаре
- addCardButton: HTMLButtonElement; - кнопка добавления товар в корзину
- deleteCardButton: HTMLButtonElement; - кнопка удаления товара из корзины
- productItemNumber: HTMLElement; - элемент, отображающий номер товара в корзине
- cardId: string; - идентификатор товара
Методы:
- set id(id: string): void - получает и сохраняет id товара
- get id(): string; - возвращает id товара
- set description(description: string): void - отображает описание товара
- set image(image: string): void - отображает изображение товара
- set title(title: string): void - отображает заголовок товара
- set category(category: string): void - отображает категорию товара
- set price(price: number | null): void - отображает цену товара
- changeButtonActivity(inBasket: boolean): void - делает кнопку добавления товара в корзину активной/не активной в зависимости от наличия данного товара в корзине и его стоимости
- set itemNumber(itemNumber: number): void - отображает номер товара в корзине

#### Класс SuccessModal
Отвечает за отображение модального окна в случае успешного оормления заказа.\
Конструктор класса принимает клонированный шаблон темплейта и экземпляр `EventEmitter` для инициации событий.\
Поля класса:
- orderSuccessCloseButton: HTMLButtonElement; - кнопка, закрывающая модальное окно
- orderSuccessDescription: HTMLElement; - поле, сообщающее об успешном списании стоимости заказа
- events: IEvents; - экземпляр класса `EventEmitter` для инициации событий
Методы класса:
- set total(total: number): void - отображает информацию о том, какая стоимость была списана


## Описание событий

- 'contacts:submit' - Отправляет информацию о заказе на сервер
- 'basket:open' - Открывает корзину
- 'basket:update' - Обновляет информацию в корзине
- 'initialData: loaded' - Выводит карточки на страницу
- 'product:select' - Открывает попап с быбранным товаром
- 'product:add' - Добавляет товар к корзину
- 'product:delete' - Удаляет товар из корзины
- 'productsInBasket:changed' - Изменяет отображение корзины
- 'basket:placeOrder' - Открывает модальное окно с формой заказа
- 'contactsFormErrors:change' - Изменяет состояние валидации формы контактов
- 'orderFormErrors:change' - Изменяет состояние валидации формы заказа	
- 'contacts:change' - Следит за изменением одного из полей в форме контактов
- 'order:change' - Следит за изменением одного из полей в форме заказа
- 'payment:choose' - Устанавливает способ оплаты
- 'order:submit' - Переходит от формы заказа к форме контактов
- 'order:success' - Открывает окно успешной покупки
- 'success:close' - Закрывает окно успешной покупки
- 'modal:open' - Блокирует прокрутку страницы при открытии модального окна
- 'modal:close' - Снимает бблокировку прокрутки страницы при закрытии модального окна
