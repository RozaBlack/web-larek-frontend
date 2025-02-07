import { IEvents } from "../base/events";
import { Component } from "../base/Component";


export interface IFormModal {
  valid: boolean;
  inputValues: Record<string, string>;
  errors: string[];
}

export class FormModal extends Component<IFormModal> {
  protected submitButton: HTMLButtonElement;
  protected formErrors: HTMLElement;
  protected formName: string;
  protected inputs: NodeListOf<HTMLInputElement>;
  protected inputButtons: NodeListOf<HTMLButtonElement>;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');
    this.inputButtons = this.container.querySelectorAll<HTMLButtonElement>('.button_alt');
    this.submitButton = container.querySelector('button[type="submit"]');
    this.formErrors = container.querySelector('.form__errors');
    this.formName = container.getAttribute('name');

    this.container.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.events.emit(`${this.formName}:submit`);
    });

    this.container.addEventListener('input', (event: InputEvent) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`${this.formName}:change`, {field, value});
    });

    if(this.inputButtons) {
      this.inputButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.events.emit(`payment:choose`, button);
          this.showSelectedPayment(button);
        })
      })
    }
  }

  set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

  set valid(isValid: boolean) {
    this.submitButton.disabled = !isValid;
  }

  set errors(value: string) {
    this.formErrors.textContent = value;
  }

  showSelectedPayment(selectedButton: HTMLButtonElement) {
    this.inputButtons.forEach(button => {
      if(button == selectedButton) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    })
  }

}