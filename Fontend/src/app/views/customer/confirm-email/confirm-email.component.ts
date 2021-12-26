import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/app-services/user-service/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/app-services/user-service/user.model';
//import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  alertMessage: string = ""
  helper = new JwtHelperService();
  constructor(private _router: Router, private userService: UserService, private activatedRoute: ActivatedRoute) { }
  token: string = ""
  ngOnInit() {
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
    const tokenEncode = this.helper.decodeToken(this.token);
    if (this.helper.decodeToken(this.token).email != null) {
      this.activeCustomer(tokenEncode.email);
      console.log(this.token)
      this.alertMessage = "Chúc mừng! Bạn đã kích hoạt tài khoản thành công!"
    } else {
      this.alertMessage = "Token sai!"
    }
  }
  // getUserByEmail(email) {
  //   var flag = this.userService.getUserByEmail(email).subscribe(data => {

  //   })
  // }
  activeCustomer(email) {
    console.log(email)
    this.userService.getUserByEmail(email).subscribe(res => {

    this.userService.users = res as User[]; 
   console.log(this.userService.users[0])
   this.userService.users[0].status = true;
   //console.log("bbb")
   this.userService.updateUser(this.userService.users[0]).subscribe(res => {  
    console.log(res)
     // setTimeout(() => {  this.statusCRUD = ""; }, 4000);
     // this.ngOnInit();
    //console.log("abc")
    },
    err => console.log(err));
   }
   );
   //console.log("aaa")
 }
}
