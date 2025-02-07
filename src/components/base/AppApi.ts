import { IOrder, IOrderData, IProduct, IProductsData, TContactsInfo, TOrderInfo } from "../../types";
import { ApiListResponse, IApi } from "./api";


export class AppApi {
	private _baseApi:IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProducts(): Promise<IProduct[]> {
    return this._baseApi.get('/product').then((productsList: ApiListResponse<IProduct>) => productsList.items);
	}

  getProductsNumber(): Promise<number> {
    return this._baseApi.get('/product').then((productsList: ApiListResponse<IProduct>) => productsList.total);
  }

	setInfo(data: TContactsInfo): Promise<IOrder> {
		return this._baseApi.post<IOrder>('/order', data, 'POST').then((res: IOrder) => res);
	}

}