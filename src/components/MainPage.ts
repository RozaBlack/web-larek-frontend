import { IEvents } from "./base/events";
import { Component } from "./base/Component";

export interface IMainPage {
  numberOfProducts: number;
  catalog: HTMLElement[];
  locked: boolean;
};

export class MainPage extends Component<IMainPage> {
  protected basketOpenButton: HTMLButtonElement;
  protected basketCounter: HTMLElement;
  protected gallery: HTMLElement;
  protected wrapper: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Элемент главной страницы в который помещаются карточки товаров
    this.gallery = this.container.querySelector('.gallery');
    this.wrapper = this.container.querySelector('.page__wrapper');
    // Кнопка для открытия корзины
    this.basketOpenButton = this.container.querySelector('.header__basket');
    // Информация о кол-ве товаров в корзине
    this.basketCounter = this.container.querySelector('.header__basket-counter');
    // Слушатель событий на кнопке открытия корзины
    this.basketOpenButton.addEventListener('click', () => events.emit('basket:open'));

  }

  set numberOfProducts(numberOfProducts: number) {
    this.basketCounter.textContent = numberOfProducts.toString();
  }

  set catalog(productCards: HTMLElement[]) {
    this.gallery.replaceChildren(...productCards);
  }

  // Сеттер для блока прокрутки
  set locked(value: boolean) {
    if (value) {
      this.wrapper.classList.add('page__wrapper_locked');
    } else {
      this.wrapper.classList.remove('page__wrapper_locked');
    }
  }

}