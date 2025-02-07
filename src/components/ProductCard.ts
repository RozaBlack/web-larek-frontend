import { IProduct, TProductCategory } from "../types";
import { CDN_URL, productCategory } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";
import { Component } from "./base/Component";

export class ProductCard extends Component<IProduct> {
  protected events: IEvents;
  protected cardCategory: HTMLElement;
  protected cardTitle: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardPrice: HTMLElement;
  protected cardText: HTMLElement;
  protected addCardButton: HTMLButtonElement;
  protected deleteCardButton: HTMLButtonElement;
  protected productItemNumber: HTMLElement;
  protected cardId: string;


  constructor(protected container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.cardCategory = this.container.querySelector('.card__category');
    this.cardTitle = this.container.querySelector('.card__title');
    this.cardImage = this.container.querySelector('.card__image');
    this.cardPrice = this.container.querySelector('.card__price');
    this.cardText = this.container.querySelector('.card__text');
    this.productItemNumber = this.container.querySelector('.basket__item-index');
    this.addCardButton = this.container.querySelector('.card__button.button');
    this.deleteCardButton = this.container.querySelector('.card__button.basket__item-delete');

    if(this.addCardButton) {
      this.addCardButton.addEventListener('click', () => {
        this.events.emit('product:add', {product: this});
    });
    } else if(this.deleteCardButton) {
      this.deleteCardButton.addEventListener('click', () => 
        this.events.emit('product:delete', {product: this})
      );
    } else {
      this.container.addEventListener('click', () => {
        this.events.emit('product:select', {productId: this.id});
      });
    }

  }

  set id(id: string) {
    this.cardId = id;
  }

  get id() {
    return this.cardId;
  }

  set description(description: string) {
    if(this.cardText) {
      this.cardText.textContent = description;
    }
  }

  set image(image: string) {
    if(this.cardImage) {
      this.cardImage.src = CDN_URL + image;
    }
  }

  set title(title: string) {
    if(this.cardTitle) {
      this.cardTitle.textContent = title;
    }
  }

  set category(category: string) {
    if(this.cardCategory) {
      this.cardCategory.textContent = category;

    Array.from(this.cardCategory.classList).forEach(className => {
        if (className.startsWith('card__category_')) {
        this.cardCategory.classList.remove(className);
      }
    });

      this.cardCategory.classList.add(`card__category_${productCategory[category as TProductCategory]}`);
    }
  }

  set price(price: number | null) {
    if(this.cardPrice) {
      if(price === null) {
        this.cardPrice.textContent = 'Бесценно';
      } else {
        this.cardPrice.textContent = price + ' синапсов';
      }
    }
  }

  changeButtonActivity(inBasket: boolean) {
    if (this.addCardButton) {
      if(inBasket) {
        this.addCardButton.disabled = true;
      } else {
        this.addCardButton.disabled = false;
      }
    }
  }

  set itemNumber(itemNumber: number) {
    if(this.productItemNumber) {
      this.productItemNumber.textContent = itemNumber.toString();
    }
  }

}