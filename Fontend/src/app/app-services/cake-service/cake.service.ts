import { Injectable } from '@angular/core';
import { Cake } from './cake.model';
import { HttpClient } from '@angular/common/http';
import{HostService} from '../aHost/Host.service';
import { CakeFiter } from './cakefilter.model';
@Injectable({
  providedIn: 'root'
})
export class CakeService {
  selectedCake: Cake;
  cake: Cake[];
  constructor(private _http: HttpClient ,private _host:HostService) { }
  readonly baseURL = this._host.host()+':3000/cakes';
  getCakeList() {
    return this._http.get(this.baseURL);
  }
  putCake(cake: Cake) {
    return this._http.put(this.baseURL + `/${cake._id}`,cake);
  }
  getCakeById(_id: String) {
    return this._http.get(this.baseURL + "/" + _id);
  }
  postCake(cake: Cake) {
    return this._http.post(this.baseURL, cake);
  }
  deleteCake(_id: string) {
    return this._http.delete(this.baseURL + `/${_id}`);
  }
  getCakeByCategoryId(category_id: string) {
    return this._http.get(this.baseURL +"/findbycategory"+ `/${category_id}`);
  }
  getCakeByAuthorId(author_id: string) {
    return this._http.get(this.baseURL +"/findbyauthor"+ `/${author_id}`);
  }
  getCakeByPrice(body: any) {
    return this._http.post(this.baseURL +"/price", body);
  }
  filterCake(body: any) {
    return this._http.post(this.baseURL +"/filter", body);
  }
  //Update Cake Quantity
  //trong function backend đã trừ ... (a - b)
  UpdateQuantity(body: any){
    return this._http.post(this.baseURL +"/CheckBillBeforePay", body);
  }
  getCakeSale(){
    return this._http.get(this.baseURL+"/getCakeSale/get");
  }

  updateSalePromotion(){

    return this._http.get(this.baseURL+"/UpdateByCakeIDAndSale/Update")
  }


  //chec list cake exist
  CheckExistListCakeID(body:any){
    return this._http.post(this.baseURL+"/CheckExistListCakeID",body)
  }
}
