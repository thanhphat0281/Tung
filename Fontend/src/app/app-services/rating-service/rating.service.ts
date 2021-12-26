import { Injectable } from '@angular/core';
import { Rating } from './rating.model';
import { HttpClient } from '@angular/common/http';
import { HostService } from '../aHost/Host.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  rating: Rating
  ratings: Rating[];

  constructor(private _http: HttpClient ,private _host:HostService) { }
  readonly baseURL = this._host.host()+':3000/ratings';
  getRatingList() {
    return this._http.get(this.baseURL);
  }
  putRating(rating: Rating) {
    return this._http.put(this.baseURL + `/${rating._id}`,rating);
  }
  getRatingById(_id: String) {
    return this._http.get(this.baseURL + "/" + _id);
  }
  postRating(rating: Rating) {
    return this._http.post(this.baseURL, rating);
  }
  deleteRating(_id: string) {
    return this._http.delete(this.baseURL + `/${_id}`);
  }
  getRatingsByCake(_id: string) {
    return this._http.get(this.baseURL + "/findcake" + `/${_id}`);
  }
  getRatingAverage(id_cake: string){
    return this._http.get(this.baseURL+'/averageRating'+`/${id_cake}`)
  }
  //Update truyền tham số vào
  UpdateRating(rating:Rating){
    return this._http.post(this.baseURL+'/UpdateRating',rating);
  }
  getRatingByUserIDCakeID(userID_cakeID){
    return this._http.post(this.baseURL+'/RatingCakeByUserID',userID_cakeID);
  }

  //lấy danh sản phẩm người dùng đánh giá
  getListRatingAccount(_id:string){
    return this._http.get(this.baseURL+"/getListRatingAccount" + `/${_id}`)
  }
}
