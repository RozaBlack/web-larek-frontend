/*Класс отвечает за хранение и логику работы с карточками товаров, полученными с сервера.\
Конструктор класса принимает экземпляр класса брокера событий\
В полях класса хранятся следующие данные:
- _products: IProduct[]; - массив товаров
- _preview: string | null; - id товара, выбранного для просмотра в модальном окне
- event: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- setProducts(): IProduct[] | undefined; - получает массив товаров с сервера
- getProduct(cardId: string): IProduct; - возвращает товар по его id
- так же есть сетторы и гетторы для сохранения и получения данных полей класса*/

import { IEvents } from "./base/events";
import { IProductsData, IProduct } from "../types";

export class ProductsData implements IProductsData {
  protected _totalNumber: number;
  protected _products: IProduct[];
  protected _preview: string | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setProducts(products:IProduct[]) {
    this._products = products;
    this.events.emit('products:changed');
  }

  getProducts() {
    return this._products;
  }

  get totalNumber() {
    return this._totalNumber;
  }

  set totalNumber(totalNumber: number) {
    this._totalNumber = totalNumber;
  }

  getProduct(productId: string) {
    return this._products.find((product) => product.id === productId)
  }

  get products() {
    return this._products;
  }

  set preview(productId: string | null) {
    if (!productId) {
        this._preview = null;
    } else if(this.getProduct(productId)){
        this._preview = productId;
        this.events.emit('product:selected')
    }
}

}