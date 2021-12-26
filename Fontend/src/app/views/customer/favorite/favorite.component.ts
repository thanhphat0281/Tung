import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//favorite
import { CakeService } from '../../../app-services/cake-service/cake.service';
import { Favorite } from 'src/app/app-services/favorite-service/favorite.model';
import { Cake } from 'src/app/app-services/cake-service/cake.model';
import { CartCakeService } from 'src/app/app-services/cartCake-service/cartCake.service';
import { CartCake } from 'src/app/app-services/cartCake-service/cartCake.model';
import { FavoriteService } from 'src/app/app-services/favorite-service/favorite.service';
declare var $: any;
@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  constructor(private _router: Router,private _favoriteService:FavoriteService,	private _cartCakeDBService: CartCakeService,private cakeService: CakeService) { }
	alertMessage = "";
	alertSucess = false;
  alertFalse = false;
  TongTien = 0;
	TongCount = 0;
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  loginBy: String = ""
  favorite: Favorite = new Favorite
  listFavorite :any
  listCakeFavorite:any
  cartCakeDB: CartCake = new CartCake;
	CartCake = [];
  lengthCartCake = 0;
  ngOnInit() {
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    // if (this.statusLogin == null) { this._router.navigate(['/account']); }
    this.loginBy = localStorage.getItem('loginBy');
    this.getTotalCountAndPrice();
    this.getAllFavoriteByUserId();
    this.getAllCakeFavorite();
 
  }
getAllCakeFavorite(){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
		this._favoriteService.getAllCakeFavoriteByUserID(this.accountSocial._id).subscribe(
			listFavorites =>{
        this.listCakeFavorite = listFavorites as Cake[];
        console.log(this.listCakeFavorite)
			}
		)
}
}
// favorite Cake
favoriteCake(cakeID){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
  this.favorite.cakeID=cakeID;
  this.favorite.userID=this.accountSocial._id
  this._favoriteService.postFavorite(this.favorite).subscribe(
    aFavorite=>{ // aFavorite sẽ trả về all favorite by userID
      this.listFavorite = aFavorite as Favorite[];
      this.ngOnInit()
  })
}else{
  this.alertMessage = "Bạn phải đăng nhập để thực hiện thao tác này";
  this.alertFalse = true;
  setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
}
}
getAllFavoriteByUserId(){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
  this._favoriteService.getAllFavoriteByUserID(this.accountSocial._id).subscribe(
    listFavorites =>{
      this.listFavorite = listFavorites as Favorite[];
    }  )
}
}
//validate favorite 
validateFavorite(id) {
if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
for(let index in this.listFavorite)
{
  if(id==this.listFavorite[index].cakeID)
  return true;
}
return false
}
return false
}







  
  moveToProfileDetail(){
    this._router.navigate(['/accountProfile'])
  }
  moveToProfileAccountSocial(){
    this._router.navigate(['/accountProfileSocial'])
  }
  goToOrderHistory(){
    this._router.navigate(['/orderHistory'])
  }
  goToDiscountCode(){
    this._router.navigate(['/discountCode'])
  }
  goToFavorite(){
    this._router.navigate(['/favorites'])
  }





  //add cake
  detailCake(cake: Cake) {

    return this._router.navigate(["/cakeDetail" + `/${cake._id}`]);
  }
  


  //#region  Add Cake Cart
	postCartCakeDB(selectedCake: Cake) {
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
			this.cartCakeDB.userID = this.accountSocial._id;
			this.cartCakeDB.cakeID = selectedCake._id;
			this.cartCakeDB.count = selectedCake.count;
			this._cartCakeDBService.postCartCake(this.cartCakeDB).subscribe(
				req => {
					console.log(req);
				},
				error => console.log(error)
			);
		}
	}
	putCartCakeDB(selectedCake: Cake) {
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
			this.cartCakeDB.userID = this.accountSocial._id;
			this.cartCakeDB.cakeID = selectedCake._id;
			this.cartCakeDB.count = selectedCake.count;
			this._cartCakeDBService.putCartCake(this.cartCakeDB).subscribe(
				req => {
					console.log(req);
				},
				error => console.log(error)
			);
		}
	}
	// check count cart before add (hover )
	checkCountMax10 = true;
	checkCountCartBeforeAdd(selectedCake: Cake) {
		this.checkCountMax10 = true;
		for (var i = 0; i < this.lengthCartCake; i++) {
			if (this.CartCake[i]._id == selectedCake._id) {
				//kiểm tra số lượng 
				if (this.CartCake[i].count == 10) {
					this.checkCountMax10 = false;
				}
				console.log(this.CartCake[i].count);
			}
		}
	}
	addACake = "";

	//add to cart (CakeDetail,CountSelect)
	// số lượng tối đa chỉ được 10 mỗi quốn sản phẩm , tính luôn đã có trong giỏ

	checkedAddCake = true;
	addToCart(selectedCake: Cake) {
		this.getCakeByCategory(selectedCake.categoryID)
		this.addACake = selectedCake.nameCake;
		var CartCake = [];    //lưu trữ bộ nhớ tạm cho localStorage "CartCake"
		var dem = 0;            //Vị trí thêm sản phẩm mới vào localStorage "CartCake" (nếu sản phẩm chưa tồn tại)
		var temp = 0;           // đánh dấu nếu đã tồn tại sản phẩm trong localStorage "CartCake" --> count ++
		// nếu localStorage "CartCake" không rỗng

		if (localStorage.getItem('CartCake') != null) {
			//chạy vòng lặp để lưu vào bộ nhớ tạm ( tạo mảng cho Object)

			for (var i = 0; i < JSON.parse(localStorage.getItem("CartCake")).length; i++) {
				CartCake[i] = JSON.parse(localStorage.getItem("CartCake"))[i];
				// nếu id cake đã tồn tại trong  localStorage "CartCake" 
				if (CartCake[i]._id == selectedCake._id) {
					temp = 1;  //đặt biến temp
					// nếu số lượng tối đa chỉ được 10 mỗi quốn sản phẩm , tính luôn đã có trong giỏ thì oke
					if (parseInt(CartCake[i].count) + 1 <= 10) {
						CartCake[i].count = parseInt(CartCake[i].count) + 1;  //tăng giá trị count
						//cập nhật cartcake vào db
						this.putCartCakeDB(CartCake[i]);
					}
					else {
						//show alert
						this.checkedAddCake = false;
						//update lại số lượng 


						this.alertMessage = "Đã tồn tại 10 quốn sản phẩm " + CartCake[i].nameCake + " trong giỏ hàng";
						this.alertFalse = true;
						setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
					}
				}
				dem++;  // đẩy vị trí gán tiếp theo
			}
		}

		if (temp != 1) {      // nếu sản phẩm chưa có ( temp =0 ) thì thêm sản phẩm vào
			selectedCake.count = 1;  // set count cho sản phẩm
			CartCake[dem] = selectedCake; // thêm sản phẩm vào vị trí "dem" ( vị trí cuối) 
			//lưu cartcake vào db
			this.postCartCakeDB(selectedCake);
		}
		// đổ mảng vào localStorage "CartCake"
		localStorage.setItem("CartCake", JSON.stringify(CartCake));

		this.getTotalCountAndPrice();
		//  //show alert
		//  this.alertMessage="Thêm thành công sản phẩm "+ selectedCake.nameCake +" vào giỏ hàng";
		//  this.alertSucess=true;
		//  setTimeout(() => {this.alertMessage="";this.alertSucess=false}, 6000); 

	}
	//#endregion

	goToCartCake(){
		return this._router.navigate(['/cartCake']);
	}
	CakeByCategory:any
	getCakeByCategory(idCategory){
		this.cakeService.getCakeByCategoryId(idCategory)
		.subscribe(resCategoryData => {

		  this.CakeByCategory = resCategoryData as Cake[];

		});
  }
  // set độ dài của giỏ hàng
	cartCakeLength(CartCake) {
		if (CartCake == null) {
			this.lengthCartCake = 0;
		} else {
			this.lengthCartCake = CartCake.length;
		}
	}
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
  formatCurrency(number) {
		var n = number.split('').reverse().join("");
		var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
		return n2.split('').reverse().join('') + 'VNĐ';
	}
}
