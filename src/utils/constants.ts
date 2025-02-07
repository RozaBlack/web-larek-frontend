import { TProductCategoryMap } from "../types";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
};

export const productCategory: TProductCategoryMap = {
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  другое: 'other',
  дополнительное: 'additional',
  кнопка: 'button'
}

export const constraintContacts = {
  email: {
    presence: {
      message: 'Укажите email'
    },
    format: {
      pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: "Email введен некорректно"
    }
  },
  phone: {
    presence: {
      message: 'Укажите намер телефона'
    },
    format: {
      pattern: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/,
      message: "Номер телефона введен некорректно"
    }
  }
}

export const constraintOrder = {
  addres: {
    presence: {
      message: 'Укажите адрес'
    },
    format: {
      pattern: /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/,
      message: "Адрес введен некорректно"
    }
  },
  payment: {
    presence: {
      message: 'Выберите способ оплаты'
    }
  }
}