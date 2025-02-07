import { IEvents } from "./base/events";
import { Component } from "./base/Component";

/*<template id="success">
		<div class="order-success">
			<h2 class="order-success__title">Заказ оформлен</h2>
			<p class="order-success__description">Списано 0 синапсов</p>
			<button class="button order-success__close">За новыми покупками!</button>
		</div>
	</template>*/

  export interface ISuccess {
    total: number;
  }

export class SuccessModal extends Component<ISuccess> {
  protected orderSuccessCloseButton: HTMLButtonElement;
  protected orderSuccessDescription: HTMLElement;
  protected events: IEvents;

  constructor(protected container: HTMLElement, events: IEvents) {
      super(container);
      this.events = events;

      this.orderSuccessCloseButton = this.container.querySelector('.order-success__close');
      this.orderSuccessDescription = this.container.querySelector('.order-success__description');

      this.orderSuccessCloseButton.addEventListener('click', () => {
        this.events.emit('success:close');
      })

  };

  set total(total: number) {
    this.orderSuccessDescription.textContent = `Списано ${total} синапсов`;
  }


}