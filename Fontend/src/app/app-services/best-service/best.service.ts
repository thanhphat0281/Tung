import { Injectable } from '@angular/core';
import { Cake } from '../cake-service/cake.model'
import { HttpClient } from '@angular/common/http';
import { HostService } from '../aHost/Host.service';

@Injectable({
  providedIn: 'root'
})
export class BestService {
  selectedCake: Cake;
  Cake: Cake[];

  constructor(private _http: HttpClient ,private _host:HostService) { }
  readonly baseURL = this._host.host()+':3000/best_selling';
  getCakeBestSelling() { 
    return this._http.get(this.baseURL+'/Cake');
  }
  getCakeOnCategoryBuyMostByUserID(userID) { 
    return this._http.get(this.baseURL+'/CakeByCategory/'+userID);
  }
  getTop10Category(){
    return this._http.get(this.baseURL+'/Top10');
  }
  getSomeNewSomeBuySomeRateBest(){
    return this._http.get(this.baseURL+'/getSomeNewSomeBuySomeRateBest');
  }

}
