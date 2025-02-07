import { IEvents } from "../base/events";
import { Component } from "../base/Component";


/* 	
  <div class="modal" id="modal-container">
		<div class="modal__container">
			<button class="modal__close" aria-label="закрыть"></button>
			<div class="modal__content">

			</div>
		</div>
	</div> 
*/


export class Modal<T> extends Component<T> {
  protected modal: HTMLElement;
  protected events: IEvents;
  //protected infoArea: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;

    const modalCloseButton = this.container.querySelector('.modal__close');

    //const content = this.container.querySelector('.modal__content');
    //console.log(content);

    modalCloseButton.addEventListener('click', this.closePopup.bind(this));
    this.container.addEventListener('mousedown', (evt) => this.closePopupOverlay(evt));
    this.closePopupEsc = this.closePopupEsc.bind(this);
  }

  set content(product: HTMLElement) {
    //console.log(this.content);
    this.container.querySelector('.modal__content').replaceChildren(product);
  }

  openPopup() {
    this.container.classList.add("modal_active");
    document.addEventListener("keyup", this.closePopupEsc);
    this.container.addEventListener("click", this.closePopupOverlay);
    this.events.emit('modal:open');
  }
  
  closePopup() {
    this.container.classList.remove("modal_active");
    document.removeEventListener("keyup", this.closePopupEsc);
    this.container.removeEventListener("click", this.closePopupOverlay);
    this.events.emit('modal:close');
  }
  
  closePopupEsc(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.closePopup();
    }
  }
  
  closePopupOverlay(evt: MouseEvent) {
    if (evt.target === evt.currentTarget) {
      this.closePopup();
    }
  }

  render(data: Partial<T>): HTMLElement {
    super.render(data);
    this.openPopup();
    return this.container;
  }

}