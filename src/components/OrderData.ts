/*Класс отвечает за хранение и логику работы с информацией о заказе.\
Конструктор класса принимает экземпляр класса брокера событий\
В полях класса хранятся следующие данные:
- payment: string; - способ оплаты товаров
- email: string; - электронная почта, введенная пользователем
- phone: string; - номер телефона, введенный пользователем
- address: string; - адрес, по которому должна осуществляться доставка, введенный пользователем;
- order: IBasket; - информация о товарах в корзине
- event: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с данными:
- setOrderData(orderData: TOrderInfo | TContactsInfo): void; - принимает и сохраняет данные заказа, введенные пользователем (способ оплаты и адрес или номер телефона и почту)
- getOrderData(): IOrder; - возвращает информацию о заказе
- checkValidation(data: Record<keyof (TOrderInfo | TContactsInfo), string>): boolean; - проверяет данные, введенные пользователем в формы. */

import { IOrder, IOrderData, TContactsInfo, TFormErrors, TOrderInfo } from "../types";
import { constraintContacts, constraintOrder } from "../utils/constants";
import { IEvents } from "./base/events";

export class OrderData implements IOrderData {
    protected _order: IOrder;
    protected events: IEvents;
    protected formErrors: TFormErrors;

    constructor(events: IEvents) {
      this.events = events;
      this._order = {address: "", payment: "", email: "", phone: "", total: null, items: undefined};
    }

    setOrderInfo(field: keyof TOrderInfo, value: string) {
      this._order[field] = value;

      if(this.checkOrderInfo()) {
        this.events.emit('order:ready', this._order);
      }
    }

    setContactsInfo(field: keyof TContactsInfo, value: string) {
      this._order[field] = value;

      if(this.checkContactsInfo()) {
        this.events.emit('contacts:ready', this._order);
      }
    }

    set items(items: string[]) {
      this._order.items = items;
    }

    set total(total: number) {
      this._order.total = total;
    }

    get order() {
      return this._order;
    }

    closeOrder() {
      this._order = {address: "", payment: "", email: "", phone: "", total: null, items: undefined};
    }

    checkContactsInfo() {
      const errors: TFormErrors = {};
        if (!this._order.email) {
          errors.email = constraintContacts.email.presence.message;
        } else if(!constraintContacts.email.format.pattern.test(this._order.email)) {
          errors.email = constraintContacts.email.format.message;
        }
        if (!this._order.phone) {
          errors.phone = constraintContacts.phone.presence.message;
        } else if(!constraintContacts.phone.format.pattern.test(this._order.phone)) {
          errors.phone = constraintContacts.phone.format.message;
        }

        this.formErrors = errors;
        console.log(this.formErrors);
        this.events.emit('contactsFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    checkOrderInfo() {
      const errors: TFormErrors = {};
        if (!this._order.address) {
          errors.address = constraintOrder.addres.presence.message;
        } else if (!constraintOrder.addres.format.pattern.test(this._order.address)) {
          errors.address = constraintOrder.addres.format.message;
        }

        if(!this._order.payment) {
          errors.payment = constraintOrder.payment.presence.message;
        }

        this.formErrors = errors;
        console.log(this.formErrors);
        this.events.emit('orderFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

}