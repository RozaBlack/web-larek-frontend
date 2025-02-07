import { IProduct, TProductCategory, TProductCategoryMap } from "../types";
import { CDN_URL, productCategory } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";
import { Component } from "./base/Component";

/* 	
  <template id="card-catalog">
		<button class="gallery__item card">
			<span class="card__category card__category_soft">софт-скил</span>
			<h2 class="card__title">+1 час в сутках</h2>
			<img class="card__image" src="<%=require('../images/Subtract.svg')%>" alt="" />
			<span class="card__price">750 синапсов</span>
		</button>
	</template> 

  
	<template id="card-preview">
		<div class="card card_full">
			<img class="card__image" src="<%=require('../images/Subtract.svg')%>" alt="" />
			<div class="card__column">
				<span class="card__category card__category_other">другое</span>
				<h2 class="card__title">Бэкенд-антистресс</h2>
				<p class="card__text">Если планируете решать задачи в тренажёре, берите два.</p>
				<div class="card__row">
					<button class="button card__button">В корзину</button>
					<span class="card__price">1000 синапсов</span>
				</div>
			</div>
		</div>
	</template>



	<template id="card-basket">
		<li class="basket__item card card_compact">
			<span class="basket__item-index">1</span>
			<span class="card__title">Фреймворк куки судьбы</span>
			<span class="card__price">2500 синапсов</span>
			<button class="basket__item-delete card__button" aria-label="удалить"></button>
		</li>
	</template>
*/

export class ProductCard extends Component<IProduct> {
  //protected element: HTMLElement;
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

  //set inBasket(inBasket: boolean) {
  //  this.inBasket = inBasket;
  //  this.changeButtonActivity();
  //}

  set itemNumber(itemNumber: number) {
    if(this.productItemNumber) {
      this.productItemNumber.textContent = itemNumber.toString();
    }
  }

}