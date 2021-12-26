import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-page',
  templateUrl: './manage-page.component.html',
  styleUrls: ['./manage-page.component.css']
})
export class ManagePageComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
  }
  moveToManageUser(){
    this._router.navigate(['/manageUser']);
  }
  moveToManageCake(){
    this._router.navigate(['/manageCake']);
  }
  moveToManageOrder(){
    this._router.navigate(['/manageOrder']);
  }
  moveToManageCategory(){
    this._router.navigate(['/manageCategory']);
  }
  moveToManageEvent(){
    this._router.navigate(['/manageEvent']);
  }
  moveToManageWheel(){
    this._router.navigate(['/manageWheel']);
  }
}
