interface IProduct {
  _id: string;
  descriotion: string;
  imageLink: string;
  title: string;
  category: string;
  price: number;
}

interface IBasket {
  _id: string;
  total: number | null;
  products: IProduct[];
}

interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  order: IBasket;
}

interface IProductsData {
  cards: IProduct[];
  preview: string | null; // указатель на карточку, которую хотим просмотреть
  getProducts(): IProduct[] | undefined;
  getProduct(productId: string): IProduct;
}

interface IBasketData {
  calculateTotalPrice(products: IProduct[]): number;
  getBasketInfo(basketId: string): IBasket;
  addProduct(card: IProduct): void;
  deleteProduct(productId: string, someFunction: Function | null): void;
  clearBasket(basketId: string): void;
  getNumberOfProducts(basketId: string): number;
}

interface IOrderData {
  setOrderData(orderData: TOrderInfo | TCustomerInfo): void;
  checkValidation(data: Record<keyof (TOrderInfo | TCustomerInfo), string>): boolean;
  getOrderData(): IOrder;
}

// Данные с которыми будет работать в компонентах
type TProductInfo = Pick<IProduct, 'descriotion' | 'imageLink' | 'title' | 'category'| 'price'>;

type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

type TCustomerInfo = Pick<IOrder, 'email' | 'phone'>;

type TBasketInfo = Pick<IBasket, 'total' | 'products'>;