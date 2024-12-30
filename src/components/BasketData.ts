/* Класс отвечает за хранение и логику работы с корзиной, содержащей список товаров к покупке.\
Конструктор класса принимает экземпляр класса брокера событий\
В полях класса хранятся следующие данные:
- id: string; - идентификатор корзины
- total: number; - суммарная стоимость товаров в корзине
- products: IProduct[]; - массив товаров, находящихся в корзине
- event: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с данными:
- calculateTotalPrice(products: IProduct[]): number; - рассчитывает суммарную стоимость товаров в корзине
- getBasketInfo(basketId: string): IBasket; - возвращает корзину по её id
- addProduct(card: IProduct): void; - добавляет товар в корзину
- deleteProduct(productId: string, someFunction: Function | null): void; - удаляет товар из корзины
- clearBasket(basketId: string): void; - отчищает корзину (удаляет все товары)
- getNumberOfProducts(basketId: string): number; - получает количество элементов в корзине по её id
- так же есть сетторы и гетторы для сохранения и получения данных полей класса*/

import { IBasket, IBasketData, IProduct } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasketData {
  protected products: IProduct[];
  protected _basket: IBasket;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this._basket = {products: [], total: null};
  }

  get basket() {
    return this._basket;
  }

  addProduct(product: IProduct) {
    if(!this._basket.products) {
      this._basket.products = [product];
    } else {
      this._basket.products.push(product);
    }
    this.events.emit('cards:changed');
  }

  deleteProduct(productId: string, someFunction: Function | null) {
    if(this._basket.products) {
      this._basket.products = this._basket.products.filter(product => product.id !== productId);
      this.events.emit('cards:changed');
    }
  }

  clearBasket(): void {
    if(this._basket.products) {
      this._basket = {products: [], total: null};
      this.events.emit('cards:changed');
    }
  }

  calculateTotalPrice(): number {
    if(!this._basket.products) {
      return null;
    } else if(this._basket.products.length === 1) {
      this._basket.total = this._basket.products[0].price;
    } else {
      this._basket.total = this._basket.products.reduce(function(sum, product2) { return (sum + product2.price)}, 0);
    }
    return this._basket.total;
  }

  getNumberOfProducts(): number {
    if(!this._basket.products) {
      return null;
    }
    return this._basket.products.length;
  }

}