import { IBasket, IBasketData, IProduct } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasketData {
  protected products: IProduct[];
  protected _basket: IBasket;
  protected events: IEvents;
  protected _total: number;

  constructor(events: IEvents) {
    this.events = events;
    this._basket = {products: []};
  }

  get basket() {
    return this._basket;
  }

  get items() {
    const items: string[] = [];
    this._basket.products.forEach(product => items.push(product.id));
    return items;
  }

  addProduct(product: IProduct) {
    if(!this._basket.products) {
      this._basket.products = [product];
    } else {
      this._basket.products.push(product);
    }
    this.events.emit('productsInBasket:changed');
  }

  deleteProduct(productId: string) {
    if(this._basket.products) {
      this._basket.products = this._basket.products.filter(product => product.id !== productId);
      this.events.emit('productsInBasket:changed');
    }
  }

  clearBasket(): void {
    if(this._basket.products) {
      this._basket = {products: []};
      this.events.emit('productsInBasket:changed');
    }
  }

  calculateTotalPrice() {
    if(!this._basket.products) {
      this._total = 0;
    } else if(this._basket.products.length === 1) {
      this._total = this._basket.products[0].price;
    } else {
      this._total = this._basket.products.reduce(function(sum, product2) { return (sum + product2.price)}, 0);
    }
  }

  get total() {
    return this._total;
  }

  get productsNumber() {
    if(!this._basket.products) {
      return null;
    }
    return this._basket.products.length;
  }

}