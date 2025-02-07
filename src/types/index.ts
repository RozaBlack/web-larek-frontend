import '../scss/styles.scss';
import { EventEmitter, IEvents } from "../components/base/events";
import { ProductsData } from "../components/ProductsData";
import { BasketData } from '../components/BasketData';
import { OrderData } from '../components/OrderData';

export type TProductCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';
export type TProductCategoryMap = {[Key in 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка']: string};

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  inBasket?: boolean;
}

export interface IBasket {
  products: IProduct[] | undefined;
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IProductsData {
  totalNumber: number;
  products: IProduct[];
  preview: string | null;
  getProduct(productId: string): IProduct;
}

export interface IBasketData {
  basket: IBasket;
  items: string[];
  productsNumber: number | null;
  total: number | null;
  calculateTotalPrice(): void;
  addProduct(product: IProduct): void;
  deleteProduct(productId: string, someFunction: Function | null): void;
  clearBasket(): void;
}

export interface IOrderData {
  order: IOrder;
  setOrderInfo(field: keyof TOrderInfo, value: string): void;
  setContactsInfo(field: keyof TContactsInfo, value: string): void;
  checkContactsInfo(): boolean;
  checkOrderInfo(): boolean;
  closeOrder(): void;
}

// Данные с которыми будет работать в компонентах

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

export type TOrderInfo =  Partial<Record<keyof Pick<IOrder, 'payment' | 'address'>, string>>;

export type TContactsInfo = Partial<Record<keyof Pick<IOrder, 'email' | 'phone'>, string>>;
