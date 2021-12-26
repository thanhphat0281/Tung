import { Injectable } from '@angular/core';
import { Cake } from '../cake-service/cake.model'
import { HttpClient } from '@angular/common/http';
import { HostService } from '../aHost/Host.service';

@Injectable({
  providedIn: 'root'
})
export class Recommend {
  selectedCake: Cake;
  Cake: Cake[];

  constructor(private _http: HttpClient ,private _host:HostService) { }
  readonly baseURL = this._host.host()+':3000';

  getAllRecommendByUserID(userID) { 
    console.log(11321312)
    return this._http.get(this.baseURL+'/datasetRecommend/Data/'+userID);
  }  
}
