import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { PointService } from 'src/app/app-services/point-service/point.service';
import { Point } from 'src/app/app-services/point-service/point.model';
import { DiscountCodeService } from 'src/app/app-services/discountCode-Service/discountCode.service';
import { DiscountCode } from 'src/app/app-services/discountCode-Service/discountCode.model';
import { Cake } from '../../app-services/cake-service/cake.model';
import { Category } from '../../app-services/category-service/category.model';
//import swal from 'sweetalert';
import { UserService } from 'src/app/app-services/user-service/user.service';
import { AuthenticateService } from 'src/app/app-services/auth-service/authenticate.service';
import { BestService } from 'src/app/app-services/best-service/best.service';
import { SegmentService } from 'src/app/app-services/segment-service/segment.service';
import { CategoryService} from '../../app-services/category-service/category.service';
import { CartCakeService } from 'src/app/app-services/cartCake-service/cartCake.service';
import { CartCake } from 'src/app/app-services/cartCake-service/cartCake.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
declare var $: any;
declare let Winwheel: any

@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.css']
})
export class CustomerLayoutComponent implements OnInit {

  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  loginBy = localStorage.getItem('loginBy');
  point: Point = new Point;
  discountCode: DiscountCode = new DiscountCode;
  pointCur: any;
  addPoint = 0;
  CartCake = [];
  TongTien = 0;
  TongCount = 0;
  lengthCartCake = 0;
  cartCakeDB: CartCake = new CartCake;
  isLoggedIn = false
  role: string = ''
  isCustomer = false
  alertFalse=false
  alertMessage = "";
  helper = new JwtHelperService();
  token: any = this.helper.decodeToken(localStorage.getItem('token'));
  constructor(private _router: Router, private userService: UserService, private authService: AuthenticateService,
    private segmentService: SegmentService,private cartCakeService: CartCakeService, private _cartCakeDB: CartCakeService,
   
    private _pointService: PointService, private _discountCode: DiscountCodeService, private _best: BestService, private categoryService: CategoryService ) {

  }
  changespinner = "chocolate";
  segments: any
  segmentsList = [] 
  segmentIndex: {}
  ngOnInit() {
    $("#changewhell").css({'float':'right','width':'90px','background-color':this.changespinner});
    $("#color").css({'color':this.changespinner});

    this.getTotalCountAndPrice();  
    this.authService.authInfo.subscribe(val => { 
      this.isLoggedIn = val.isLoggedIn;
      this.role = val.role;
      this.isCustomer = this.authService.isCustomer()
      this.accountSocial = JSON.parse(this.authService.getAccount())
    });
    //this.getTop10Category()
    this.getAllCategory()
    console.log("cartcake:"+ this.cartCakeDB)
  }

  getTop10Category() {
    this._best.getTop10Category().subscribe(
      top10 => {
        this.topCategory = top10 as Category[]
        console.log("List category:"+ this.topCategory)
        
      }
    )
  }
  topCategory :any
  getAllCategory(){
    this.categoryService.getCategoryList().subscribe((res) => {
			this.categoryService.categories = res as Category[] ;
    })
  }
  // set độ dài của giỏ hàng
	cartCakeLength(CartCake) {
		if (CartCake == null) {
			this.lengthCartCake = 0;
		} else {
			this.lengthCartCake = CartCake.length;
		}
  }
  // refreshCartCakeList() {
	// 	this.cartCakeService.getCartCakeList().subscribe((res) => {
	// 		this.cartCakeService.cartCake = res as CartCake[];
	// 	});
	// }
	//get total count and price 
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
  detailCake(selectedCake: Cake) {

		return this._router.navigate(["/cakeDetail" + `/${selectedCake._id}`]);
	}
  moveToAccount() {
    return this._router.navigate(['/account']);
  }
  moveToLogin() {
    return this._router.navigate(['/login']);
  }
  moveToRegister() {
    return this._router.navigate(['/register']);
  }
  moveToHome() {

    return this._router.navigate(['/']);
  }

  moveToProfile() {
    return this._router.navigate(['/profile']);
  }
  moveToaccountProfile() {
    return this._router.navigate(['/accountProfile']);
  }
  moveToCart() {
    return this._router.navigate(['/cartCake']);
  }
  logout() {
    this.authService.logout();    
		$('#tongtien').html("&nbsp;" + this.formatCurrency("0"));
		$('.cart_items').html("0");
		localStorage.setItem("TongTien", "0");
    localStorage.setItem("TongCount", "0");
    // alert("alo")
    this._router.navigate(['/homePage']);
  }
  getPointByUserID() {
    //get point user by userID

    this._pointService.getPointByUserID(this.accountSocial._id).subscribe(
      Point => {
        localStorage.setItem("Point", Object.values(Point)[0].point);
        this.point.point = Object.values(Point)[0].point;
      },
      error => console.log(error)
    );
  }
  ChangeWheelSpnner(event: any) {
    this.changespinner = event.target.value;
    this.ngOnInit();
  }

  //search
  InputSearch = "";
  getInputSearch(event) {
    this.InputSearch = event.target.value;
    console.log(this.InputSearch)
  }
  Search() {
    var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (this.InputSearch != "" && !format.test(this.InputSearch)) {
      return this._router.navigate(['/aboutUs/' + `/${this.InputSearch}`]);
    } else
      if (format.test(this.InputSearch)) {
        Swal.fire({
          text: "Không được chứa ký tự đặc biệt!",
          icon: 'warning',
          showCancelButton: true,  
      confirmButtonText: 'Ok',  
      //cancelButtonText: 'Cancel'
        })
      }
  }

  goToCategory(id) {
    return this._router.navigate(['/rountlv2/category/' + `/${id}`])
  }
  goToSale() {
    return this._router.navigate(['/rountlv2/sale/listSale'])
  }
}
