import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HostService } from '../aHost/Host.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private _http: HttpClient ,private _host:HostService) { }
  readonly baseURL = this._host.host()+':3000/statistic';
  getFourCakesBuyTheMost() {
    return this._http.get(this.baseURL+'/FourCakeBuyTheMost');
  }
  getCakesBuyTheMost() {
    return this._http.get(this.baseURL+'/BuyTheMost');
  }
  getCakesBuyTheMostOnWeek() {
    return this._http.get(this.baseURL+'/CakeBuyTheMostOnWeek');
  }
  getCakesBuyTheMostOnMonth() {
    return this._http.get(this.baseURL+'/CakeBuyTheMostOnMonth');
  }
  getCakesBuyTheMostOnYear() {
    return this._http.get(this.baseURL+'/CakeBuyTheMostOnYear');
  }
  TotalPriceOnWeek(){
    return this._http.get(this.baseURL+'/TotalPriceOnWeek');
  }
  TotalPriceOnMonth(body: any){
    return this._http.post(this.baseURL+'/TotalPriceOnMonth', body);
  }
  TotalPriceOnYear(yearCheck){
    return this._http.get(this.baseURL+'/TotalPriceOnYear/'+yearCheck);
  }
  BestUserOnYear(yearCheck){
    return this._http.get(this.baseURL+'/BestUser/'+yearCheck);
  }
  BestUserOnMonth(body: any){
    return this._http.post(this.baseURL+'/BestUserOnMonth', body);
  }
  TotalPriceOnEachMonth(body: any){
    return this._http.post(this.baseURL+'/TotalPriceOnEachMonth',body);
  }
}
