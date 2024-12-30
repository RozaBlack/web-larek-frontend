import '../scss/styles.scss';
import { EventEmitter, IEvents } from "../components/base/events";
import { ProductsData } from "../components/ProductsData";
import { BasketData } from '../components/BasketData';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IBasket {
  total: number | null;
  products: IProduct[] | undefined;
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  order: IBasket;
}

export interface IProductsData {
  totalNumber: number;
  products: IProduct[];
  preview: string | null; // указатель на карточку, которую хотим просмотреть
  setProducts(products:IProduct[]): void;
  getProducts(): IProduct[] | undefined;
  getProduct(productId: string): IProduct;
}

export interface IBasketData {
  basket: IBasket;
  calculateTotalPrice(): number;
  //getBasketInfo(): IBasket;
  addProduct(product: IProduct): void;
  deleteProduct(productId: string, someFunction: Function | null): void;
  clearBasket(): void;
  getNumberOfProducts(): number;
}

export interface IOrderData {
  setOrderData(orderData: TOrderInfo | TCustomerInfo): void;
  checkValidation(data: Record<keyof (TOrderInfo | TCustomerInfo), string>): boolean;
  getOrderData(): IOrder;
}

// Данные с которыми будет работать в компонентах
type TProductInfo = Pick<IProduct, 'description' | 'image' | 'title' | 'category'| 'price'>;

type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

type TCustomerInfo = Pick<IOrder, 'email' | 'phone'>;

type TBasketInfo = Pick<IBasket, 'total' | 'products'>;





const events: IEvents = new EventEmitter();

const productsData = new ProductsData(events);

const testCards = {
  "total": 10,
  "items": [
      {
          "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
          "description": "Если планируете решать задачи в тренажёре, берите два.",
          "image": "/5_Dots.svg",
          "title": "+1 час в сутках",
          "category": "софт-скил",
          "price": 750
      },
      {
          "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
          "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
          "image": "/Shell.svg",
          "title": "HEX-леденец",
          "category": "другое",
          "price": 1450
      },
      {
          "id": "b06cde61-912f-4663-9751-09956c0eed67",
          "description": "Будет стоять над душой и не давать прокрастинировать.",
          "image": "/Asterisk_2.svg",
          "title": "Мамка-таймер",
          "category": "софт-скил",
          "price": null
      },
      {
          "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
          "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
          "image": "/Soft_Flower.svg",
          "title": "Фреймворк куки судьбы",
          "category": "дополнительное",
          "price": 2500
      },
      {
          "id": "1c521d84-c48d-48fa-8cfb-9d911fa515fd",
          "description": "Если орёт кот, нажмите кнопку.",
          "image": "/mute-cat.svg",
          "title": "Кнопка «Замьютить кота»",
          "category": "кнопка",
          "price": 2000
      },
      {
          "id": "f3867296-45c7-4603-bd34-29cea3a061d5",
          "description": "Чтобы научиться правильно называть модификаторы, без этого не обойтись.",
          "image": "Pill.svg",
          "title": "БЭМ-пилюлька",
          "category": "другое",
          "price": 1500
      },
      {
          "id": "54df7dcb-1213-4b3c-ab61-92ed5f845535",
          "description": "Измените локацию для поиска работы.",
          "image": "/Polygon.svg",
          "title": "Портативный телепорт",
          "category": "другое",
          "price": 100000
      },
      {
          "id": "6a834fb8-350a-440c-ab55-d0e9b959b6e3",
          "description": "Даст время для изучения React, ООП и бэкенда",
          "image": "/Butterfly.svg",
          "title": "Микровселенная в кармане",
          "category": "другое",
          "price": 750
      },
      {
          "id": "48e86fc0-ca99-4e13-b164-b98d65928b53",
          "description": "Очень полезный навык для фронтендера. Без шуток.",
          "image": "Leaf.svg",
          "title": "UI/UX-карандаш",
          "category": "хард-скил",
          "price": 10000
      },
      {
          "id": "90973ae5-285c-4b6f-a6d0-65d1d760b102",
          "description": "Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.",
          "image": "/Mithosis.svg",
          "title": "Бэкенд-антистресс",
          "category": "другое",
          "price": 1000
      }
  ]
};

testCards.total
testCards.items
testCards.items[0];

productsData.setProducts(testCards.items);

console.log(productsData.getProducts());
console.log(productsData.getProduct("b06cde61-912f-4663-9751-09956c0eed67"));

const basket = new BasketData(events);
console.log(JSON.stringify(basket));

basket.addProduct(productsData.getProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
console.log(basket.calculateTotalPrice());
console.log(basket.getNumberOfProducts());
console.log(JSON.stringify(basket));

basket.addProduct(productsData.getProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
console.log(basket.calculateTotalPrice());
console.log(basket.getNumberOfProducts());
console.log(JSON.stringify(basket));

basket.addProduct(productsData.getProduct("b06cde61-912f-4663-9751-09956c0eed67"));
console.log(basket.calculateTotalPrice());
console.log(basket.getNumberOfProducts());
console.log(JSON.stringify(basket));

basket.addProduct(productsData.getProduct("412bcf81-7e75-4e70-bdb9-d3c73c9803b7"));
console.log(basket.calculateTotalPrice());
console.log(basket.getNumberOfProducts());
console.log(JSON.stringify(basket));

basket.deleteProduct("854cef69-976d-4c2a-a18c-2aa45046c390", null);
console.log(basket.calculateTotalPrice());
console.log(basket.getNumberOfProducts());
console.log(JSON.stringify(basket));

basket.deleteProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9", null);
console.log(basket.calculateTotalPrice());
console.log(basket.getNumberOfProducts());
console.log(JSON.stringify(basket));

basket.clearBasket();

console.log(basket.calculateTotalPrice());
console.log(basket.getNumberOfProducts());
console.log(JSON.stringify(basket));
