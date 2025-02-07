import { IProduct } from "../types";
import { IEvents } from "./base/events";
import { Modal } from "./common/Modal";
import { ProductCard } from "./ProductCard";

export class ModalWithProduct extends Modal<IProduct> {
  protected product: ProductCard;

  constructor (container: HTMLElement, events: IEvents) {
    super(container, events);
    this.product = new ProductCard(container, events);
  }
}