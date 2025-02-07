import { IEvents } from "./base/events";
import { FormModal } from "./common/FormModal";

export interface IOrderInfo {
  
}

export class OrderFormModal extends FormModal {
  constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
    }
}