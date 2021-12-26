import { Injectable } from '@angular/core';
import { CartCake } from './cartCake.model';
import { HttpClient } from '@angular/common/http';
import { HostService } from '../aHost/Host.service';

@Injectable({
  providedIn: 'root'
})
export class CartCakeService {
  selectedCartCake: CartCake;
  cartCake: CartCake[];

  constructor(private _http: HttpClient ,private _host:HostService) { }
  readonly baseURL = this._host.host()+':3000/cartCakes';
  getCartCakeList() {
    return this._http.get(this.baseURL);
  }
  putCartCake(cartCake: CartCake) {
    return this._http.post(this.baseURL+"/updateCartCake",cartCake);
  }
  getCartCakeById(_id: String) {
    return this._http.get(this.baseURL + "/" + _id);
  }
  postCartCake(cartCake: CartCake) {
    return this._http.post(this.baseURL, cartCake);
  }
  //delete One CartCake
  deleteOneCartCake(cartCake: CartCake) {
    return this._http.post(this.baseURL +"/deleteOneCartCake",cartCake);
  }
  //delete all by userID
  deleteAllCartCakeByUserID(_id: string) {
    return this._http.delete(this.baseURL+ "/deleteByUserID" + `/${_id}`);
  }
  //get all cartcakeDB by userID
  getAllCartCakeDBByUserID(_id: string){
    return this._http.get(this.baseURL+ "/getAllCartCakeByUserID" + `/${_id}`);
  }
  
}
