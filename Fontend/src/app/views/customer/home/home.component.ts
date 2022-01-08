import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CakeService } from '../../../app-services/cake-service/cake.service';
import { Cake } from '../../../app-services/cake-service/cake.model';
import { CategoryService } from '../../../app-services/category-service/category.service';
import { Category } from '../../../app-services/category-service/category.model';
import { CakeFiter } from '../../../app-services/cake-service/cakefilter.model';
import { CartCakeService } from 'src/app/app-services/cartCake-service/cartCake.service';
import { CartCake } from 'src/app/app-services/cartCake-service/cartCake.model';
import { Point } from 'src/app/app-services/point-service/point.model';
import { PointService } from 'src/app/app-services/point-service/point.service';
import Swal from 'sweetalert2';
//recommend
import { BestService } from '../../../app-services/best-service/best.service';
import { Recommend } from '../../../app-services/recommendSys-service/recommendSys.service';
//favorite
import { Favorite } from 'src/app/app-services/favorite-service/favorite.model';
import { FavoriteService } from 'src/app/app-services/favorite-service/favorite.service';
import { AuthenticateService } from 'src/app/app-services/auth-service/authenticate.service';
//promotion
import{Promotion} from 'src/app/app-services/promotion-service/promotion.model';
import{PromotionService} from 'src/app/app-services/promotion-service/promotion.service';
declare var $: any;
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	success: Boolean = false;
	//
	customOptions: any
	constructor(private _router: Router, private cakeService: CakeService,private authService: AuthenticateService,
		private _cartCakeDBService: CartCakeService, private _pointService: PointService,private cartCakeService: CartCakeService
		,private cakeCategoryService: CategoryService, private _bestService: BestService,private _recommendSyS:Recommend,private _favoriteService:FavoriteService,private _promotion:PromotionService) {

	}
	//chứa thông tin giỏ hàng
	CartCake = [];
	TongTien = 0;
	TongCount = 0;
	point: Point = new Point;
	lengthCartCake = 0;
	accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
	cartCakeDB: CartCake = new CartCake;

	isLoggedIn = false
	role: string = ''
	isCustomer = false
	cakeFilter: CakeFiter = new CakeFiter();
	//loai banh
	cakesCategory: []
	category_id: string;
	//recommend
	bestCakeList: Cake = new Cake;
	bestCategoryList: Category = new Category;
	CakeByListCategoryBest:any
	favorite: Favorite = new Favorite
	listFavorite :any
	IsNeedLoadRecommend=true;		//recommend chỉ chạy 1 lần thôi (để đỡ load nhiều)
	ngOnInit() {
		this.cakeService.updateSalePromotion().subscribe(data2 => {
			  })
		this.getAllFavoriteByUserId();
		$('.searchHeader').attr('style', 'font-size: 1.6rem !important');
		this.script_Frontend();
		
		//this.refreshCartCakeList();
		this.getTotalCountAndPrice();
		this.get3Promotion();
		// recommend chỉ chạy 1 lần thôi (để đỡ load nhiều)	(2 trạng thái đăng nhập có sự thay đổi thì mới chạy recommends)
		if(this.accountSocial!=null){
			localStorage.setItem("StatusLoginNow","true");
			if(localStorage.getItem("StatusLoginNow")!=localStorage.getItem("StatusLoginBefore"))
			{
				this.IsNeedLoadRecommend = true
				localStorage.setItem("StatusLoginBefore","true");
			}
		}else{
			localStorage.setItem("StatusLoginNow","false");
			if(localStorage.getItem("StatusLoginNow")!=localStorage.getItem("StatusLoginBefore"))
			{
				this.IsNeedLoadRecommend = true
				localStorage.setItem("StatusLoginBefore","false");
			}
		}
		if(JSON.parse(localStorage.getItem("listBestCake"))== null||this.IsNeedLoadRecommend==true){
			this.IsNeedLoadRecommend=false
			//this.getBestCakeAndRecommend();
		}
		this.LoadBestCakeAndRecommendSecond();
		this.checkCartCakeDBAndLocalStorage();

	    this.authService.authInfo.subscribe(val => {
			this.isLoggedIn = val.isLoggedIn;
			this.role = val.role;
			this.isCustomer = this.authService.isCustomer()
			this.accountSocial = JSON.parse(this.authService.getAccount())
			this.RecommendByUser();
		  });
		  
		  //this.category_id = localStorage.getItem('category_id');
		  this.getCakeByCategory('5fe5a55531a1704d7086c60f');
		  this.refreshCategoryList();
		  this.refreshCakeList();
	}

	startPageCategories: Number;
  	paginationLimitCategories: Number;
	//recommend
	theloai1:any
	theloai2:any
	ListCakeCategory1:any
	ListCakeCategory2:any
	IsRecommend = false

	ListrateRecommend:any
	IsRateRecommend=false

	ListClickRecommend:any
	IsClickRecommend=false

	ListBuyRecommend:any
	IsBuyRecommend=false
	LoadBestCakeAndRecommendSecond(){
		if(localStorage.getItem("listBestCake")){
		this.bestCakeList = JSON.parse(localStorage.getItem("listBestCake"))[1] as Cake
		this.bestCategoryList =  JSON.parse(localStorage.getItem("listBestCake"))[0] as Category
		}
		this._bestService.getSomeNewSomeBuySomeRateBest().subscribe(
			listTop3=>{
				this.top3New = listTop3["CakeListNew"] as Cake
				this.top5Buy = listTop3["CakeListBuyMost"] as Cake
				this.top3Rate = listTop3["DataListRateMost"] as Cake
				console.log( listTop3["CakeListNew"])
			}
		)
	}
	//top3 show (new,buy,rate)
	top3New:any
	top5Buy:any
	top3Rate:any

	getBestCakeAndRecommend() {
		this._bestService.getCakeBestSelling().subscribe(
			listBestCake => {
				localStorage.setItem("listBestCake", JSON.stringify(listBestCake));
				this.bestCakeList = listBestCake[1] as Cake
				this.bestCategoryList = listBestCake[0] as Category
			});

	}
	RecommendByUser()
	{
		console.log(this.accountSocial)
			//get 2 thể loại mà người dùng thích nhất để show sản phẩm theo thể loại
			if(this.accountSocial != null){
				this._bestService.getCakeOnCategoryBuyMostByUserID(this.accountSocial._id).subscribe(
					listBestCakeOnCategory => {

						this.CakeByListCategoryBest = listBestCakeOnCategory as Cake
						if(this.CakeByListCategoryBest.length > 1)
						{
							this.IsRecommend = true
							this.theloai1=Object.keys(this.CakeByListCategoryBest[0])[0]
							this.theloai2=Object.keys(this.CakeByListCategoryBest[1])[0]
							this.ListCakeCategory1=Object.values(this.CakeByListCategoryBest[0])[0]
							this.ListCakeCategory2=Object.values(this.CakeByListCategoryBest[1])[0]
						}else{
							this.IsRecommend = false
						}

					});
				this._recommendSyS.getAllRecommendByUserID(this.accountSocial._id).subscribe(
					listAllRecommend =>{

						this.ListClickRecommend = listAllRecommend['click'] as Cake
						this.ListrateRecommend = listAllRecommend['rate'] as Cake
						this.ListBuyRecommend = listAllRecommend['buy'] as Cake

						if(this.ListClickRecommend.length>6)
						{
							this.IsClickRecommend=true
						}else{
							this.IsClickRecommend=false
						}

						if(this.ListrateRecommend.length>6)
						{
							this.IsRateRecommend=true
						}else{
							this.IsRateRecommend=false
						}

						if(this.ListBuyRecommend.length>6)
						{
							this.IsBuyRecommend=true
						}else{
							this.IsBuyRecommend=false
						}
					}
				)
			}
	}
	script_Frontend() {
		this.customOptions = {
			loop: false,
			mouseDrag: true,
			touchDrag: true,
			pullDrag: true,
			dots: true,
			navSpeed: 700,
			nav: false,
			navText: ['<img src = "../../assets/img/02/Previous.png" />',
				'<img src = "../../assets/img/02/Next.png" id = "btnNavRight"/>'],
			navClass: ['owl-prev', 'owl-next'],
			responsive: {
				0: {
					items: 1
				},
				400: {
					items: 2
				},
				740: {
					items: 3
				},
				940: {
					items: 4
				},
				1100: {
					items: 4
				}
			}
		}
		$(function () {
			$("#scrollToTopButton").click(function () {
				$("html, body").animate({ scrollTop: 0 }, 1000);
			});

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
	//#endregion
	formatCurrency(number) {
		var n = number.split('').reverse().join("");
		var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
		return n2.split('').reverse().join('') + 'VNĐ';
	}
	showCategory(id: String) {
		var category: any;
		this.cakeCategoryService.getCategoryById(id).subscribe((res) => {
		  this.cakeCategoryService.categories = res as Category[];
		  category = res;
		});
	  }
	goToCategory(id) {
		return this._router.navigate(['/rountlv2/category/' + `/${id}`])
	  }
	  goToSale() {
		return this._router.navigate(['/rountlv2/sale/listSale'])
	  }


	moveToShop() {
		return this._router.navigate(['/cakesCategory']);
	}

	moveToCakeCategory() {
		return this._router.navigate(['/cakesCategory']);
	}
	moveToCakeDetail() {
		return this._router.navigate(['/cakeDetail']);
	}
	selectedCake = [];
	detailCake(cake: Cake) {

		return this._router.navigate(["/cakeDetail" + `/${cake._id}`]);
	}
	refreshCakeList() {
		this.cakeService.getCakeList().subscribe((res) => {
			this.cakeService.cake = res as Cake[];
		});
	}
	refreshCategoryList() {
		this.cakeCategoryService.getCategoryList().subscribe((res) => {
		  this.cakeCategoryService.categories = res as Category[];
		 	});
	  }
	refreshCartCakeList() {
		this.cartCakeService.getCartCakeList().subscribe((res) => {
			this.cartCakeService.cartCake = res as CartCake[];
		});
	}
	//Kiểm tra so sánh cartcakeLocal và cartcakeDB
	checkCartCakeDBAndLocalStorage() {
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
			this._cartCakeDBService.getAllCartCakeDBByUserID(this.accountSocial._id).subscribe(
				cartCakeDB => {
					//kiểm tra xem cartcake và cartcakeDB có khớp không
					if (this.lengthCartCake == 0) {
						//load cartcakeDB by userID lên localStosrage (neu co)
						this.CartCake = cartCakeDB as Cake[]
						localStorage.setItem("CartCake", JSON.stringify(this.CartCake));
						this.getTotalCountAndPrice();
					} else if (Object.keys(cartCakeDB).length == 0) {
						for (var i = 0; i < this.lengthCartCake; i++) {
							this.postCartCakeDB(this.CartCake[i]);
						}
					}
					else if (Object.keys(cartCakeDB).length != this.lengthCartCake) {
						//xóa hết db user // lưu lại mới theo localstorage
						this.mergeCartCakeAndCartCakeDB(cartCakeDB);

					} else {
						var temp = 0
						// kiểm tra các value bên trong
						for (var i = 0; i < this.lengthCartCake; i++) {
							for (var j = 0; j < Object.keys(cartCakeDB).length; j++) {
								if (this.CartCake[i]._id == Object.values(cartCakeDB)[j]._id) {
									if (this.CartCake[i].count == Object.values(cartCakeDB)[j].count) {
										temp++;
									}
								}
							}
						}
						if (temp != this.lengthCartCake) {
							//xóa hết db user // lưu lại mới theo localstorage
							this.mergeCartCakeAndCartCakeDB(cartCakeDB);
						}
					}

				},
				error => console.log(error)
			);
			//get point user by userID
			this._pointService.getPointByUserID(this.accountSocial._id).subscribe(
				Point => {

					//nếu chưa tạo Point thì set = 0
					if (Object.keys(Point).length == 0) {
						this.point.userID = this.accountSocial._id;
						this.point.point = 0;
						this._pointService.postPoint(this.point).subscribe(
							pointNew => {
								localStorage.setItem("Point", Object.values(pointNew)[0].point);
							}
						);
					} else {
						console.log(Object.values(Point)[0].point);
						localStorage.setItem("Point", Object.values(Point)[0].point);
					}
				},
				error => console.log(error)
			);
		}
	}
	//xóa hết db by UserID
	deleteAllCartCakeDBByUserID(id) {
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {

			this._cartCakeDBService.deleteAllCartCakeByUserID(id).subscribe(
				req => {
					for (var i = 0; i < this.lengthCartCake; i++) {
						this.postCartCakeDB(this.CartCake[i]);
					}
				},
				error => console.log(error)
			);
		}
	}
	//
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
	getCakeById(id: string) {
		this.cakeService.getCakeById(id).subscribe((res) => {

		});
	}
	//Xóa hết DB lưu lại theo giỏ hàng
	mergeCartCakeAndCartCakeDB(cartCakeDB: Object) {
		Swal.fire({
			text: "Giỏ hàng cũ của bạn chưa được thanh toán ,bạn có muốn gộp giỏ hàng cũ vào không ?",
			icon: 'warning',
			showCancelButton: true,  
      confirmButtonText: 'Ok',  
      cancelButtonText: 'Cancel'
		  }).then((willDelete) => {
			if(willDelete){

			//gộp cartcake
			for (var i = 0; i < Object.keys(cartCakeDB).length; i++) {
				for (var j = 0; j < this.lengthCartCake; j++) {
					if (this.CartCake[j]._id == Object.values(cartCakeDB)[i]._id) {
						this.CartCake[j].count += Object.values(cartCakeDB)[i].count;
						if (this.CartCake[j].count > 10) {
							this.CartCake[j].count = 10;
						}
						break;
					}
					if (j == this.lengthCartCake - 1) {
						//add
						this.CartCake.push(Object.values(cartCakeDB)[i]);
					}
			}
			localStorage.setItem("CartCake", JSON.stringify(this.CartCake));
			this.getTotalCountAndPrice();
		}
		this.deleteAllCartCakeDBByUserID(this.accountSocial._id);
		Swal.fire({
            title: "",
            text: "Gộp giỏ hàng thành công",
            icon: 'success'
          });
			}

		});

	}


	//#region go To Cake Detail
	clickGoToCakeDetail(id) {
		return this._router.navigate(['/cakeDetail/' + id]);
	}
	//#endregion
	//#region  Add Cake Cart

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
	alertMessage = "";
	alertSucess = false;
	alertFalse = false;
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
					// nếu số lượng tối đa chỉ được 10 mỗi sản phẩm , tính luôn đã có trong giỏ thì oke
					if (parseInt(CartCake[i].count) + 1 <= 10) {
						CartCake[i].count = parseInt(CartCake[i].count) + 1;  //tăng giá trị count
						//cập nhật cartcake vào db
						this.putCartCakeDB(CartCake[i]);
					}
					else {
						//show alert
						this.checkedAddCake = false;
						//update lại số lượng


						this.alertMessage = "Đã tồn tại 10 sản phẩm " + CartCake[i].nameCake + " trong giỏ hàng";
						this.alertFalse = true;
						setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
					}
				}
				dem++;  // đẩy vị trí gán tiếp theo
			}
		}

		if (temp != 1) {      // nếu sp chưa có ( temp =0 ) thì thêm sp vào
			selectedCake.count = 1;  // set count cho sp
			CartCake[dem] = selectedCake; // thêm sản phẩm vào vị trí "dem" ( vị trí cuối)
			//lưu cartcake vào db
			this.postCartCakeDB(selectedCake);
		}
		//this.refreshCartCakeList();
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
	CakeByCategory: any;
	getCakeByCategory(idCategory){
		this.cakeService.getCakeByCategoryId(idCategory)
		.subscribe(resCategoryData => {
		  this.CakeByCategory = resCategoryData as Cake[];
		  console.log(this.CakeByCategory);
		});
		this.refreshCakeList();
  }

  goToHome(){
    this._router.navigate(['/homePage'])
  }

	// favorite Cake
	favoriteCake(cakeID){
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
		this.favorite.cakeID=cakeID;
		this.favorite.userID=this.accountSocial._id
		this._favoriteService.postFavorite(this.favorite).subscribe(
			aFavorite=>{ // aFavorite sẽ trả về all favorite by userID
				this.listFavorite = aFavorite as Favorite[];
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
			}
		)
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

//get 3 promotion
ListPromotion:any
get3Promotion(){
	this._promotion.getTop3Promotion().subscribe(list=>{
		this.ListPromotion = list as Promotion
		console.log(this.ListPromotion)
	})
}
}


