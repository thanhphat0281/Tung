import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  host() {
    // return "http://192.168.1.16";
    return "http://localhost";
  }
}
