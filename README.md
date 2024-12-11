# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемых в приложении

Карточка

```
interface IProduct {
  _id: string;
  description: string;
  imageLink: string;
  title: string;
  category: string;
  price: number;
}
```

Корзина

```
interface IBasket {
  _id: string;
  total: number | null;
  products: IProduct[];
}
```

Заказ

```
interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  order: IBasket;
}

```

Данные, использующиеся в карточке с описанием товара

```
type TProductInfo = Pick<IProduct, 'description' | 'imageLink' | 'title' | 'category'| 'price'>;
```

Информация об оплате и доставке в форме заказа товаров

```
type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;
```

Контактные данные покупателя в форме заказа товаров

```
type TCustomerInfo = Pick<IOrder, 'email' | 'phone'>;
```

Данные о товарах в корзине

```
type TBasketInfo = Pick<IOrder, 'total' | 'items'>;
```

## Архитектура приложения

Приложение орниавано в соответствии с парадигмой MVP и разделено на следующие слои:
- слой представления, отвечающий за отображение данных на странице,
- слой данных, отвечающий за хранение и отображение данных,
- презентер, отвечающий за связь представления и данных.

### Базовый код

#### Класс Api
Реализация логики работы с сервером.\
Конструктор класса принимает базовый адрес сервера и опциональный объект с заголовками запросов.\
Методы класса:
- handleResponse(response: Response): Promise<object> - обрабатывает ответ сервера
- get(uri: string) - принимает изменяющеюся часть url-адреса, возвращает ответ от сервера
- post(uri: string, data: object, method: ApiPostMethods = 'POST') - принимает изменяющеюся часть url-адреса

#### Класс EventEmitter
Выступает в роли брокера событий, а также в роли Представителя (Presentor) в принципе MVP. Позволяет отправлять и подписываться на события.\

Методы:
- on<T extends object>(eventName: EventName, callback: (event: T) => void) - подписывает на событие
- off(eventName: EventName, callback: Subscriber) - отписывает от события
- emit<T extends object>(eventName: string, data?: T) - уведомляет подписчиков о наступлении события
- onAll(callback: (event: EmitterEvent) => void) - подписывает на все события
- offAll() - сбрасывает всех подписчиков
- trigger<T extends object>(eventName: string, context?: Partial<T>) - создает событие с заданными аргументами

### Слой данных

#### IProductsData
Класс отвечает за хранение и логику работы с карточками товаров, полученными с сервера.\
Конструктор класса принимает экземпляр класса брокера событий\
В полях класса хранятся следующие данные:
- _cards: IProduct[]; - массив товаров
- _preview: string | null; - id товара, выбранного для просмотра в модальном окне
- event: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- setProducts(): IProduct[] | undefined; - получает массив товаров с сервера
- getProduct(cardId: string): IProduct; - возвращает товар по его id
- так же есть сетторы и гетторы для сохранения и получения данных полей класса

#### IBasketData
Класс отвечает за хранение и логику работы с корзиной, содержащей список товаров к покупке.\
Конструктор класса принимает экземпляр класса брокера событий\
В полях класса хранятся следующие данные:
- _id: string; - идентификатор корзины
- total: number; - суммарная стоимость товаров в корзине
- products: IProduct[]; - массив товаров, находящихся в корзине
- event: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с данными:
- calculateTotalPrice(products: IProduct[]): number; - рассчитывает суммарную стоимость товаров в корзине
- getBasketInfo(basketId: string): IBasket; - возвращает корзину по её id
- addProduct(card: IProduct): void; - добавляет товар в корзину
- deleteProduct(productId: string, someFunction: Function | null): void; - удаляет товар из корзины
- clearBasket(basketId: string): void; - отчищает корзину (удаляет все товары)
- getNumberOfProducts(basketId: string): number; - получает количество элементов в корзине по её id
- так же есть сетторы и гетторы для сохранения и получения данных полей класса

#### IOrderData

Класс отвечает за хранение и логику работы с информацией о заказе.\
Конструктор класса принимает экземпляр класса брокера событий\
В полях класса хранятся следующие данные:
- payment: string; - способ оплаты товаров
- email: string; - электронная почта, введенная пользователем
- phone: string; - номер теефона, введенный пользователем
- address: string; - адрес, по которому должна осуществляться доставка, введенный пользователем;
- order: IBasket; - информация о товарах в корзине
- event: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с данными:
- setOrderData(orderData: TOrderInfo | TCustomerInfo): void; - принимает и сохраняет данные заказа, введенные пользователем (способ оплаты и адрес или номер телефона и почту)
- getOrderData(): IOrder; - возвращает информацию о заказе
- checkValidation(data: Record<keyof (TOrderInfo | TCustomerInfo), string>): boolean; - проверяет данные, введенные пользователем в формы.

### Классы представления

#### Класс MainPageView
Отвечает за отображение всех карточек товара на главной странице сайта, а также кнопки корзины и информации о количестве товаров в корзине.\
Конструктор класса принимает DOM элемент страницы и экземпляр класса `EventEmitter` для инициации событий.\

Методы:
- set productsNumber(prNumb: number) - выводит количество жлементов в корзине
- set productCards(products: HTMLElement[]) - выводит карточки товаров на страницу

#### Класс Modal
Реализует модальное окно и предоставляет методы `open` и `close` для открытия и закрытия модального окна. Устанавливает слушатели событий на Esc на клавиатуре и клики на оверлей и кнопку-крестик для закрытия попапа.\
Конструктор класса принимает селектор по которому будет идентифицироваться модальное окно в разметке страницы и экземпляр класса `EventEmitter` для инициации событий:
- constructor(selector: string, event: IEvents)

Поля класса:
- modal: HTMLElement - элемент модального окна
- event: IEvents - экземпляр класса `EventEmitter` для инициации событий.

#### Класс ModalWithInfo
Предназначен для реализации модального окна подтверждения успешности заказа.\
Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- _totalSum: number - итоговая сумма заказа

Методы:
- get totalSum: number - геттер для получения итоговой суммы заказа


#### Класс ModalWithForm
Предназначен для реализации модального окна с формой содержащей поля ввода. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы и открывает следующующее модальное окно. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.\
Конструктор, принимает клонированный шаблон темплейта.\

Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- errors: Record<string, HTMLElement> - объект хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- setInputValues(data: Record<string, string>): void - принимает объект с данными для заполнения полей формы
- get form: HTMLElement - геттер для получения элемента формы


#### Класс ModelWithBasketView
Отвечает за отображение корзины с товарами. Класс отображает нумерованный список с элементами в корзине, а также отображает их суммарную стоимость.\
В конструктор класса передается DOM элемент темплейта. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Конструктор принимает клонированный шаблон темплейта и экземпляр `EventEmitter` для инициации событий.\
Поля класса:
- basket: IBasket - содержание корзины
Методы:
- getTotalSum(basket: IBasket): number - получает суммарную стоимость всех товаров в корзине
- getNumberOfProducts(basket: IBasket): number - получает количество элементов в корзине

#### Класс ProductCardView
Отвечает за отображение карточки товара на странице сайта, задавая в карточке название, изображение, стоимость, категорию товара. В конструктор класса передается DOM элемент темплейта. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Конструктор, принимает клонированный шаблон темплейта и экземпляр `EventEmitter` для инициации событий.\
Методы:
- setData(productData: IProduct): void - заполняет атрибуты элементов карточки данными
- render(): HTMLElement - метод возвращает полностью заполненную карточку с установленными слушателями
- геттер id возвращает уникальный id карточки

#### Класс ModalWithProductView
Расширяет класс ProductCardView. Отвечает за отображение модального окна с карточкой товара.\
В конструктор класса передается DOM элемент темплейта. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Конструктор, принимает клонированный шаблон темплейта и экземпляр `EventEmitter` для инициации событий.\
Методы:
- pricelessProduct(productData: IProduct): void - блокирует возможность добавить товар в корзину в случае, если он бесценен