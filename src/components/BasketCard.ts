/* 
	<template id="card-basket">
		<li class="basket__item card card_compact">
			<span class="basket__item-index">1</span>
			<span class="card__title">Фреймворк куки судьбы</span>
			<span class="card__price">2500 синапсов</span>
			<button class="basket__item-delete card__button" aria-label="удалить"></button>
		</li>
	</template>

	<template id="basket">
		<div class="basket">
			<h2 class="modal__title">Корзина</h2>
			<ul class="basket__list"></ul>
			<div class="modal__actions">
				<button class="button basket__button">Оформить</button>
				<span class="basket__price">0 синапсов</span>
			</div>
		</div>
	</template>

  <button class="header__basket">
					<span class="header__basket-counter">0</span>
				</button>
*/

import { IBasket } from "../types";
import { IEvents } from "./base/events";
import { Component } from "./base/Component";

export class BasketCard extends Component<IBasket> {
    protected events: IEvents;
    protected basketList: HTMLElement;
    protected createOrderButton: HTMLButtonElement;
    protected basketPrice: HTMLElement; 
    protected cardId: string;
  
  
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