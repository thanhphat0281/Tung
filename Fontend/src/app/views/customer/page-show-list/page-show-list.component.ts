import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { CakeService } from '../../../app-services/cake-service/cake.service';
import { Cake } from '../../../app-services/cake-service/cake.model';
import { CategoryService } from '../../../app-services/category-service/category.service';
import { Category } from '../../../app-services/category-service/category.model';
import { Session } from 'protractor';
import { AuthorService } from '../../../app-services/author-service/author.service';
import { Author } from '../../../app-services/author-service/author.model';
import { FormGroup, FormControl } from '@angular/forms';
import { CakeFiter } from '../../../app-services/cake-service/cakefilter.model';
import { SocialAccount } from 'src/app/app-services/socialAccount-service/socialaccount.model';
import { CartCakeService } from 'src/app/app-services/cartCake-service/cartCake.service';
import { CartCake } from 'src/app/app-services/cartCake-service/cartCake.model';
//favorite
import { Favorite } from 'src/app/app-services/favorite-service/favorite.model';
import { FavoriteService } from 'src/app/app-services/favorite-service/favorite.service';
declare var $: any
@Component({
  selector: 'app-page-show-list',
  templateUrl: './page-show-list.component.html',
  styleUrls: ['./page-show-list.component.css']
})
export class PageShowListComponent implements OnInit {
 
  pageOfItems: Array<any>;
  cakes: Array<Cake> = new Array<Cake>();


  cakeFilter: CakeFiter = new CakeFiter();
  //alert
  alertMessage = "";
  alertSucess = false;
  alertFalse = false;
  cartCakeDB: CartCake = new CartCake;
  constructor(private _router: Router,private route: ActivatedRoute, private cakeService: CakeService, private authorService: AuthorService,
    private cakeCategoryService: CategoryService, private _cartCakeDB: CartCakeService,private _favoriteService:FavoriteService) {
  }
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));

  id = this.route.snapshot.paramMap.get('id');
  namefilter = this.route.snapshot.paramMap.get('name');
  favorite: Favorite = new Favorite
  listFavorite :any
  nameShow=""
  ngOnInit() {
    this.getAllFavoriteByUserId();
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
    //set độ dài cartCake
    this.cartCakeLength(this.CartCake);
    //set value giỏ hàng trên thanh head 
    this.getTotalCountAndPrice();
    console.log("namefilter: "+ this.namefilter)
    if(this.namefilter=="category"){
      this.getCakeByCategoryId(this.id)
      this.getNameCategroy(this.id)
    }else
    if(this.namefilter=="sale"){
      this.getCakeSale()
      this.nameShow = "Sản Phẩm Giảm Giá"
    }
    
  
  }
  getCakeSale(){
    this.cakeService.getCakeSale().subscribe(ListCake=>{
      this.cakes=ListCake as Cake[]
    })
  }
getCakeByCategoryId(id){
this.cakeService.getCakeByCategoryId(id).subscribe(ListCake=>{
  this.cakes = ListCake as Cake[]

})
}
 
getNameCategroy(id){
    this.cakeCategoryService.getCategoryById(id).subscribe(aCategory=>{
      this.nameShow =aCategory["nameCategory"]
    })
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
    //nếu sản phẩm không có trong cartcake ( chưa từng thêm vào giỏ)

  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
  selectedCake = [];
  detailCake(cake: Cake) {
    return this._router.navigate(['/cakeDetail/' + `/${cake._id}`]);

  }



  getid_cake(id) {
    localStorage.setItem('cake_detail', id);
  }









  change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
  }


  addACake = "";
  //add to cart (CakeDetail,CountSelect)
  // số lượng tối đa chỉ được 10 mỗi quốn sản phẩm , tính luôn đã có trong giỏ

  checkedAddCake = true;
  addToCart(selectedCake: Cake) {
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

  //get total count and price 
  TongTien = 0;
  TongCount = 0;
  CartCake = [];
  lengthCartCake = 0;
  getTotalCountAndPrice() {
    this.TongTien = 0;
    this.TongCount = 0;
    this.CartCake = JSON.parse(localStorage.getItem("CartCake"));
    this.cartCakeLength(this.CartCake);
    if (this.CartCake != null) {
      for (var i = 0; i < this.lengthCartCake; i++) {
        this.TongTien += parseInt((parseInt(this.CartCake[i].priceCake) * parseInt(this.CartCake[i].count) * (100 - this.CartCake[i].sale) / 100).toFixed(0));
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
  // set độ dài của giỏ hàng
  cartCakeLength(CartCake) {
    if (CartCake == null) {
      this.lengthCartCake = 0;
    } else {
      this.lengthCartCake = CartCake.length;
    }
  }

  // go to cart cake
  goToCartCake() {
    this._router.navigate(['/cartCake']);
  }

  startPage: Number;
  paginationLimit: Number;

  startPageCategories: Number;
  paginationLimitCategories: Number;
  showMoreItems() {
    this.paginationLimit = this.authorService.authors.length;
  }
  showLessItems() {
    this.paginationLimit = 5;
  }
  showMoreCategories() {
    this.paginationLimitCategories = this.cakeCategoryService.categories.length;
  }
  showLessCategories() {
    this.paginationLimitCategories = 5;
  }

  postCartCakeDB(selectedCake: Cake) {
    if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
      this.cartCakeDB.userID = this.accountSocial._id;
      this.cartCakeDB.cakeID = selectedCake._id;
      this.cartCakeDB.count = selectedCake.count;
      this._cartCakeDB.postCartCake(this.cartCakeDB).subscribe(
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
      this._cartCakeDB.putCartCake(this.cartCakeDB).subscribe(
        req => {
          console.log(req);
        },
        error => console.log(error)
      );
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

}
