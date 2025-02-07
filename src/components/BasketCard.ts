import { IBasket } from "../types";
import { IEvents } from "./base/events";
import { Component } from "./base/Component";

export class BasketCard extends Component<IBasket> {
    protected events: IEvents;
    protected basketList: HTMLElement;
    protected createOrderButton: HTMLButtonElement;
    protected basketPrice: HTMLElement;
  
  
    constructor(protected container: HTMLElement, events: IEvents) {
      super(container);
      this.events = events;
  
      this.basketList = this.container.querySelector('.basket__list');
      this.createOrderButton = this.container.querySelector('.basket__button');
      this.basketPrice = this.container.querySelector('.basket__price');
  
      
      this.createOrderButton.addEventListener('click', () => {
        this.events.emit('basket:placeOrder', {product: this});
      });
  }

  set content(product: HTMLElement[]) {
    this.container.querySelector('.basket__list').replaceChildren(...product);
  }

  set total(price: number) {
    this.basketPrice.textContent = `${price} синапсов`;
  }

  changeButtonActivity(numberOfProducts: number) {
    if(numberOfProducts == 0) {
      this.createOrderButton.disabled = true;
    }
    else {
      this.createOrderButton.disabled = false;
    }
  }

}