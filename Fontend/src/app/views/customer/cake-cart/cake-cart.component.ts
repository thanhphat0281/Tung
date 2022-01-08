import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, ActivatedRoute } from '@angular/router';
import { Cake } from '../../../app-services/cake-service/cake.model';
import { CartCakeService } from 'src/app/app-services/cartCake-service/cartCake.service';
import { CartCake } from 'src/app/app-services/cartCake-service/cartCake.model';
import { DiscountCodeService } from 'src/app/app-services/discountCode-Service/discountCode.service';
import { DiscountCode } from 'src/app/app-services/discountCode-Service/discountCode.model';
import { CakeService } from 'src/app/app-services/cake-service/cake.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';
//import Swal from 'sweetalert';
import { truncateSync } from 'fs';
declare var $: any;
@Component({
  selector: 'app-cake-cart',
  templateUrl: './cake-cart.component.html',
  styleUrls: ['./cake-cart.component.css'],

})
export class CakeCartComponent implements OnInit {
  helper = new JwtHelperService();
  token: any = this.helper.decodeToken(localStorage.getItem('token'));
  constructor(private _router: Router, private _cartCakeDB: CartCakeService,
     private _discountCode: DiscountCodeService,private _cake:CakeService,
     private _cartCakeDBService:CartCakeService) {

  }
  //#region Buộc phải có trên các component
  //chứa thông tin giỏ hàng
  CartCake = [];
  ListCakeSameCartCake=[]
  // Lưu tổng tiền và tổng số lượng chung
  TongTien = 0;
  TongCount = 0;
  //thông tin login 
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  //#endregion

  // kiểm tra giỏ hàng rỗng
  checkViewCart = false;
  lengthCartCake = 0;
  //alert
  alertMessage = "";
  alertSucess = false;
  alertFalse = false;
  cartCakeDB: CartCake = new CartCake;
  discountCode: DiscountCode = new DiscountCode;
  ngOnInit() {
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    if (localStorage.getItem('DiscountCode') != null) {
      this.discountCode = JSON.parse(localStorage.getItem('DiscountCode'));
    } else {
      this.discountCode.discountCode = 0;
    }
    console.log(this.discountCode.discountCode)
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });

    //#region Buộc phải có trên các component
    this.verifyCartCake()
    //get giỏ hàng
    this.CartCake = JSON.parse(localStorage.getItem("CartCake"));
    //set độ dài cartCake
    this.cartCakeLength(this.CartCake);
    //set value giỏ hàng trên thanh head 
    this.getTotalCountAndPrice();
    //#endregion

    // Hiện ra label khi giỏ hàng rỗng
    this.CheckViewCart();
    //valid quantity và rate trong cartCake

  }
  unUseDiscountCode(){
    localStorage.removeItem('DiscountCode');
    this.ngOnInit();
  }
  //#region Buộc phải có trên các component
  quantity: number = 1;
  i = 1
  plus(id) {
    for (let j = 0; j < this.CartCake.length; j++) {
      if (this.CartCake[j]._id == id) {
        if (this.CartCake[j].count < 10) {
          this.CartCake[j].count++;
          this.updateCartCake(this.CartCake[j]._id, this.CartCake[j].count);
        }
         else {
        this.alertMessage = "Bạn chỉ được nhập tối đa 10 sản phẩm";
        this.alertFalse = true;
        setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
      }
      }
     
    }
  }
  minus(id) {
    for (let j = 0; j < JSON.parse(localStorage.getItem("CartCake")).length; j++) {
        if (this.CartCake[j]._id == id) {
          if (this.CartCake[j].count > 1) {
          this.CartCake[j].count--;
          this.updateCartCake(this.CartCake[j]._id, this.CartCake[j].count);
        }
        else{
        }
      }
    }
  }
  // set độ dài của giỏ hàng
  cartCakeLength(CartCake) {
    if (CartCake == null) {
      this.lengthCartCake = 0;
    } else {
      this.lengthCartCake = CartCake.length;
    }
  }

  //get total count and price trên header
  getTotalCountAndPrice() {
    this.TongTien = 0;
    this.TongCount = 0;
    this.CartCake = JSON.parse(localStorage.getItem("CartCake"));
    this.cartCakeLength(this.CartCake);
    if (this.CartCake != null) {
      for (var i = 0; i < this.lengthCartCake; i++) {
        this.TongTien += parseInt((parseInt(this.CartCake[i].priceCake) * parseInt(this.CartCake[i].count)*(100-this.CartCake[i].sale)/100).toFixed(0));  
        this.TongCount += parseInt(this.CartCake[i].count);
      }
    }
    $('#tongtien').html("&nbsp;" + this.formatCurrency(this.TongTien.toString()));
    $('.cart_items').html(this.TongCount.toString());
    localStorage.setItem("TongTien", this.TongTien.toString());
    localStorage.setItem("TongCount", this.TongCount.toString());
  }
  //#endregion
   formatCurrency(number){
    var n = number.split('').reverse().join("");
    var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");    
    return  n2.split('').reverse().join('') + 'VNĐ';
}
  //check header giỏ hàng
  CheckViewCart() {
    if (this.CartCake == null || this.lengthCartCake == 0) {
      this.checkViewCart = true;
    }
    else {
      this.checkViewCart = false;
    }
  }


  // cờ hiệu của alert
  checkedAddCake = true;
  //get count onChange --> updateCartCake
  getCountUpdate(event: any, id) {
    console.log(event.target.value);
    this.checkedAddCake = true;
    // kiểm tra xem có lớn hơn 10 ko
    if (event.target.value <= 10) {
      console.log("update");
      this.updateCartCake(id, event.target.value);
    } else {
      //show alert
      this.checkedAddCake = false;
      //update lại số lượng 
      localStorage.setItem("CartCake", JSON.stringify(this.CartCake));
      this.ngOnInit();
      this.alertMessage = "Bạn chỉ được nhập tối đa 10 sản phẩm";
      this.alertFalse = true;
      setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
    }
  }
  //Update Cart Cake
  resany: any
  updateCartCake(id, count) {
    //kiểm tra cake[id].count có bằng 0 không ,... nếu =0 thì ==> gửi qua hàm xóa
    if (this.checkedAddCake) {
      for (var i = 0; i < this.lengthCartCake; i++) {
        //tìm id được chọn để edit 
        if (this.CartCake[i]._id == id) {
          if (count == 0) {
           //this.deleteCartCake(id);
            localStorage.setItem("CartCake", JSON.stringify(this.CartCake));
            this.ngOnInit();
          }
          else {
            this._cake.getCakeById(id).subscribe(
              acake=>{
                this.resany = acake as Cake
                this.CartCake[i].quantity= this.resany.quantity;
                this.CartCake[i].count = count;
                this.CartCake[i].rate = this.resany.rate;
                //update cartcake DB
                this.putCartCakeDB(this.CartCake[i]);
                localStorage.setItem("CartCake", JSON.stringify(this.CartCake));
                this.ngOnInit();
              })
          }
          break;
        }
      }
    }
  }
  // Delete Cart Cake
  deleteCartCake(id) {
    Swal.fire({
      text: "Bạn có chắc muốn xóa sản phẩm này trong giỏ hàng ?",
      icon: 'warning',
      showCancelButton: true,  
      confirmButtonText: 'Ok',  
      cancelButtonText: 'Cancel'
    })
    .then((willDelete) => {
        if(willDelete){
          for (var i = 0; i < this.lengthCartCake; i++) {
            if (this.CartCake[i]._id == id) {
              this.deleteOneCartCakeDB(this.CartCake[i]);
              this.CartCake.splice(i, 1);
              break;
            }
          }
          Swal.fire({
            title: "Đã xóa xong!",
            text: "Sản Phẩm này đã được xóa trong giỏ hàng.",
            icon: 'success'
          });
          localStorage.setItem("CartCake", JSON.stringify(this.CartCake));
        }
        this.ngOnInit();
    });
  
  }
  //click vào hình chuyển về detail
  ViewCakeDetail(idCake) {
    return this._router.navigate(["/cakeDetail" + `/${idCake}`]);
  }

  checkoutWhenNull() {
    var setconfirm = confirm('Giỏ hàng của bạn đang trống , bạn có muốn dạo mua một vòng không ?')
    if (setconfirm == true) {
      this.goToHome();
    }
  }
  goToHome() {
    this._router.navigate(['/homePage']);
  }

  CheckQuantiTy(){
    for(let index in this.CartCake){
      if(this.CartCake[index].quantity < this.CartCake[index].count)
      {
        return false
      }
    }
    return true
  }
  goToShipping() {
 
    if (this.token == null) {
      this._router.navigate(['/account']);
    } else if(this.CheckQuantiTy() == false){
      this.alertMessage = "Hiện Không Đáp Ứng Được Đơn Hàng Của Bạn ! \nVui Lòng Kiểm Tra Lại Số Lượng Giỏ Hàng";
      this.alertFalse = true;
      setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
    }else
    {
      let token_exp = this.token.exp;
      let time_now = new Date().getTime() / 1000;
      if (time_now < token_exp) {
        this._router.navigate(['/shipping']);
      } else {
        // alert("Token is valid");
        localStorage.removeItem("accountSocial");
        localStorage.removeItem("token");
        localStorage.removeItem("loginBy");
        localStorage.removeItem("statusLogin");
        // this._router.navigate(['/account']);
        this.alertMessage = "Phiên làm việc của bạn đã hết hạn! Vui lòng đăng nhập lại!";
        this.alertFalse = true;
        setTimeout(() => { document.location.href = '/account'; }, 2000);
      }
    }
  }

  putCartCakeDB(selectedCake: Cake) {
    if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
      this.cartCakeDB.userID = this.accountSocial._id;
      this.cartCakeDB.cakeID = selectedCake._id;
      this.cartCakeDB.count = selectedCake.count;
      this._cartCakeDB.putCartCake(this.cartCakeDB).subscribe(
        req => {
          console.log(req);
        },
        error => console.log(error)
      );
    }
  }
  deleteOneCartCakeDB(selectedCake: Cake) {
    if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
      this.cartCakeDB.userID = this.accountSocial._id;
      this.cartCakeDB.cakeID = selectedCake._id;
      this.cartCakeDB.count = selectedCake.count;
      this._cartCakeDB.deleteOneCartCake(this.cartCakeDB).subscribe(
        req => {
          console.log(req);
        },
        error => console.log(error)
      );
    }
  }
  goToDiscountCode(){
    this._router.navigate(['/discountCode']);
  }
  //dùng dể verify số lượng và sao 
  verifyCartCake(){
    if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
			this._cartCakeDBService.getAllCartCakeDBByUserID(this.accountSocial._id).subscribe(
				cartCakeDB => {
          this.CartCake = cartCakeDB as Cake[]
          localStorage.setItem("CartCake", JSON.stringify(this.CartCake));
        })
  }
}}
