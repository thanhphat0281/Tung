import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorService } from '../../../app-services/author-service/author.service';
import { Author } from '../../../app-services/author-service/author.model';
import { CategoryService } from '../../../app-services/category-service/category.service';
import { Category } from '../../../app-services/category-service/category.model';
import { CakeService } from '../../../app-services/cake-service/cake.service';
import { Cake } from '../../../app-services/cake-service/cake.model';
import { RatingService } from '../../../app-services/rating-service/rating.service';
import { Rating } from '../../../app-services/rating-service/rating.model';
import { NgForm } from '@angular/forms';
import { SocialaccountService } from '../../../app-services/socialAccount-service/socialaccount.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { UserService } from '../../../app-services/user-service/user.service';
import { User } from '../../../app-services/user-service/user.model';
import { SocialAccount } from 'src/app/app-services/socialAccount-service/socialaccount.model';
import { CartCakeService } from 'src/app/app-services/cartCake-service/cartCake.service';
import { CartCake } from 'src/app/app-services/cartCake-service/cartCake.model';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FavoriteService } from '../../../app-services/favorite-service/favorite.service'
//dataset Recommend
import { datasetRecommend } from '../../../app-services/recommendSys-service/dataRecommend-service/dataRecommend.model'
import { DatasetRecommendService } from 'src/app/app-services/recommendSys-service/dataRecommend-service/dataRecommend.service';
//favorite
import { Favorite } from 'src/app/app-services/favorite-service/favorite.model';

declare var $: any

@Component({
  selector: 'app-cake-detail',
  templateUrl: './cake-detail.component.html',
  styleUrls: ['./cake-detail.component.css']
})
//open modal
export class CakeDetailComponent implements OnInit {
  public linkRead: string;
  private subscription: Subscription;
  private timer: Observable<any>;
  pageOfItems: Array<any>;
  cakes: Array<Cake>;
  id_category: String = ""
  // loginBy: String = ""
  // statusLogin: String = ""
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  cartCakeDB: CartCake = new CartCake;
  datasetRecommend : datasetRecommend = new datasetRecommend;
  constructor(private _router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private authorService: AuthorService, private cakeService: CakeService,private categoryService: CategoryService,
    private ratingService: RatingService, private accountSocialService: SocialaccountService,
    private userService: UserService, private _cartCakeDB: CartCakeService,
    private _favoriteService: FavoriteService, private _datasetRecommend : DatasetRecommendService) {
    //#region js for star
    var wc_single_product_params = { "i18n_required_rating_text": "Please select a rating", "review_rating_required": "yes" };
    $(function (a) {
      return "undefined" != typeof wc_single_product_params && (a("body")
        .on("init", ".wc-tabs-wrapper, .woocommerce-tabs", function () {
          a(".wc-tab, .woocommerce-tabs .panel:not(.panel .panel)").hide();
          var b = window.location.hash, c = window.location.href, d = a(this).find(".wc-tabs, ul.tabs").first();
          b.toLowerCase().indexOf("comment-") >= 0 || "#reviews" === b || "#tab-reviews" === b ? d.find("li.reviews_tab a")
            .click() : c.indexOf("comment-page-") > 0 || c.indexOf("cpage=") > 0 ? d.find("li.reviews_tab a").click() : d.find("li:first a").click()
        })
        .on("click", ".wc-tabs li a, ul.tabs li a", function (b) {
          b.preventDefault();
          var c = a(this), d = c.closest(".wc-tabs-wrapper, .woocommerce-tabs"), e = d.find(".wc-tabs, ul.tabs"); e.find("li")
            .removeClass("active"), d.find(".wc-tab, .panel:not(.panel .panel)").hide(), c.closest("li").addClass("active"),
            d.find(c.attr("href")).show()
        }).on("click", "a.woocommerce-review-link", function () {
          return a(".reviews_tab a")
            .click(), !0
        }).on("init", "#rating", function () {
          a("#rating").hide()
            .before('<p class="stars"><span><a class="star-1" href="#">1</a><a class="star-2" href="#">2</a><a class="star-3" href="#">3</a><a class="star-4" href="#">4</a><a class="star-5" href="#">5</a></span></p>')
        })
        .on("click", "#respond p.stars a", function () {
          var b = a(this), c = a(this).closest("#respond").find("#rating"),
            d = a(this).closest(".stars"); return c.val(b.text()), b.siblings("a").removeClass("active"), b.addClass("active"),
              d.addClass("selected"), !1
        }).on("click", "#respond #submit", function () {
          var b = a(this).closest("#respond")
            .find("#rating"), c = b.val(); if (b.length > 0 && !c && "yes" === wc_single_product_params.review_rating_required)
            return window.alert(wc_single_product_params.i18n_required_rating_text), !1
        }),
        void a(".wc-tabs-wrapper, .woocommerce-tabs, #rating").trigger("init"))
    });
    //#endregion
  }
  customOptions: any
  //chứa thông tin giỏ hàng
  CartCake = [];
  TongTien = 0;
  TongCount = 0;
  lengthCartCake = 0;

  userID_cakeID = { userID: "", cakeID: "" }
  IsRate = false
  idCake = this.route.snapshot.paramMap.get('id');
  ListRatingAccount:any
  favorite: Favorite = new Favorite
  listFavorite :any

  ngOnInit() {
    $('.searchHeader').attr('style', 'font-size: 1rem !important');
    $('.wrapper a img').attr('style', 'border: 1px solid transparent !important');
    $('.wrapper a img').attr('style', 'border: 1px solid transparent !important');
    $('#username').attr('style', 'font-size: 16px !important;background-color: transparent;border-color: transparent;color: green;');
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });
      $('#moreRating').click(function () {
        $('html,body').animate({
          scrollTop: $("#ratingList").offset().top
        },
          'slow');
      });

      $('.bar span').hide();
      $('#bar-five').animate({
        width: '75%'
      }, 1000);
      $('#bar-four').animate({
        width: '35%'
      }, 1000);
      $('#bar-three').animate({
        width: '20%'
      }, 1000);
      $('#bar-two').animate({
        width: '15%'
      }, 1000);
      $('#bar-one').animate({
        width: '30%'
      }, 1000);

      setTimeout(function () {
        $('.bar span').fadeIn('slow');
      }, 1000);

      $('#imgFamiliar').click(function () {
        $('.imagepreview').attr('src', $(this).find('img').attr('src'));
        // $('#modalImgFamiliar').modal('show');
        alert($(this).find('img').attr('src'));
      });
      $('#dislike').click(function () {
        $('.fa').css('color', 'red')
      });
    });
    //#endregion
    this.resetForm();
    this.getAllFavoriteByUserId();
    //set độ dài cartCake
    this.cartCakeLength(this.CartCake);
    //set value giỏ hàng trên thanh head
    this.getTotalCountAndPrice();
    this.DataSetRecommend(this.idCake,0,0,1);
    this.getListRatingAccount(this.idCake)
    this.getCakeById(this.idCake);
    // this.getAllAccount();
    this.getRatingsByCakeID(this.idCake);
    // this.getAllUsers();
    // this.getRatinngAverage(this.idCake);


  }


  // set độ dài của giỏ hàng
  cartCakeLength(CartCake) {
    if (CartCake == null) {
      this.lengthCartCake = 0;
    } else {
      this.lengthCartCake = CartCake.length;
    }
  }
  // getAllUsers() {
  //   this.userService.getAllUsers().subscribe(res => {
  //     this.userService.users = res as User[];
  //     console.log(this.userService.users);
  //   })
  // }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
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

  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.ratingService.rating = {
      _id: "",
      cakeID: "",
      userID: "",
      star: "",
      review: ""
    };
  }
  getAuthorById(id: string) {
    this.authorService.getAuthorById(id).subscribe((res) => {
      this.authorService.author = res as Author;
      // console.log(res);
    });
  }

  getCategoryById(id: string) {
    this.categoryService.getCategoryById(id).subscribe((res) => {
      this.categoryService.category = res as Category;
      // console.log(res);
    });
  }

  detailCake(cake: Cake) {
    return this._router.navigate(["/cakeDetail" + `/${cake._id}`]);
  }

  getCakeById(id: string) {
    var cakes: any
    this.cakeService.getCakeById(id).subscribe((res) => {
      this.cakeService.selectedCake = res as Cake;
      cakes = res;
      this.getCategoryById(cakes.categoryID);
      this.gettypeCategory(cakes.categoryID);
      this.getRatingsByCakeID(id);
      window.scrollTo(0, 0)
      this.checkGetCountCakeDetailEqual10(id);
      // this.getRatingAverageByCake(id);
      this.userID_cakeID.cakeID = this.cakeService.selectedCake._id;
      this.userID_cakeID.userID = JSON.parse(localStorage.getItem('accountSocial'))._id;

      this.ratingService.getRatingByUserIDCakeID(this.userID_cakeID).subscribe(
        data => {
          console.log("hello")
          console.log(data)

          this.ratingService.rating = Object.values(data)[0];
          $(".description_tab").addClass("active")
          $(".reviews_tab").removeClass("active")
          $("#tab-description").css("display","block")
          $("#tab-reviews").css("display","none")
        },
        error => console.log(error)
      );
    });
  }
  gettypeCategory(id) {
    this.cakeService.getCakeByCategoryId(id)
      .subscribe(resCategoryData => {
        // console.log(resCategoryData);
        this.cakes = resCategoryData as Cake[];
        // console.log(this.cakes);
      });
  }
  account_social = [];
  getRatingsByCakeID(id: string) {
    this.ratingService.getRatingsByCake(id).subscribe((res) => {
      this.ratingService.ratings = res as Rating[];
      //console.log("Cakes By Id");
      //console.log(res)
    });
  }

  getListRatingAccount(id:string){
    this.ratingService.getListRatingAccount(id).subscribe((res) => {
      this.ListRatingAccount = res
      this.startPageRatings = 0;
      this.paginationLimitRatings = 3;
    });
  }
  // getAllAccount() {
  //   this.accountSocialService.getAllAccountSocial().subscribe(res => {
  //     this.accountSocialService.socialAccounts = res as SocialAccount[];
  //   })
  // }
  statusRating: boolean = false;

  onSubmit(form: NgForm) {

    // this.statusLogin = localStorage.getItem('statusLogin');
    // this.loginBy = localStorage.getItem('loginBy')

    if (this.accountSocial != null) {
      let cake_id = this.route.snapshot.paramMap.get('id');
      form.value.cakeID = cake_id;
      let id_user = JSON.parse(localStorage.getItem('accountSocial'))._id;
      form.value.userID = id_user;

      this.DataSetRecommend(cake_id,0, form.value.star,0);
      this.ratingService.getRatingByUserIDCakeID(form.value).subscribe(
        data => {

          //nếu có rồi thì update
          if (Object.keys(data).length > 0 && Object.values(data)[0].star !=0 ) { //
            this.UpdateRating(form);

          } else { //chưa có thì insert
            this.PostRating(form);
          }
          this.ngOnInit()
        },
        error => console.log(error)
      );

    }
  }
  UpdateRating(form) {
    console.log("update rate")
    this.ratingService.UpdateRating(form.value).subscribe(
      dataUpdate => {
        console.log(dataUpdate)
        this.statusRating = true;
        form.resetForm();
        this.ngOnInit();
        this.timer = Observable.timer(5000); // 5000 millisecond means 5 seconds
        this.subscription = this.timer.subscribe(() => {
          // set showloader to false to hide loading div from view after 5 seconds
          this.statusRating = false;
        });
      },
      error => console.log(error)
    );
  }
  PostRating(form) {
    console.log("post rate")
    this.ratingService.postRating(form.value).subscribe(
      dataPost => {
        // console.log(data);
        console.log(dataPost)
        this.statusRating = true;
        form.resetForm();
        this.ngOnInit();
        this.timer = Observable.timer(5000); // 5000 millisecond means 5 seconds
        this.subscription = this.timer.subscribe(() => {
          // set showloader to false to hide loading div from view after 5 seconds
          this.statusRating = false;
        });
      },
      error => console.log(error)
    );
  }
  // số lượng add tối đa chỉ được 10 mỗi quốn sản phẩm , tính luôn đã có trong giỏ
  //##1 sự kiện change input
  alertFalse = false;
  alertMessage = "";
  checkedAddCake = true;
  countCakeDetailCur = 0;
  getcountDetail(selectedCake: Cake, event: any) {

    this.checkedAddCake = true;
    //console.log(this.countCakeDetailCur);
    //nếu nhập 0
    if (event.target.value == 0) {
      //show alert
      this.checkedAddCake = false;
      this.alertMessage = "Bạn không thể mua sản phẩm với số lượng bằng 0";
      this.alertFalse = true;
      setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
    }
    else
      if (event.target.value > 10) {
        //show alert
        this.checkedAddCake = false;


        this.alertMessage = "Bạn chỉ được nhập tối đa 10 quốn sản phẩm";
        this.alertFalse = true;
        setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
      } else {
        var CountMax10 = parseInt(event.target.value) + (this.countCakeDetailCur);


        if (CountMax10 > 10) {
          //show alert
          this.checkedAddCake = false;
          //update lại số lượng

          this.alertMessage = "số lượng tối đa chỉ được 10 mỗi quốn sản phẩm , tính luôn đã có trong giỏ hàng";
          this.alertFalse = true;
          setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
        }
      }
    if (!this.checkedAddCake) {
      $("#count").val(1);
    }
    console.log(this.checkedAddCake);
  }

  paginationLimit: Number;

  startPageRatings: Number;
  paginationLimitRatings: Number;
  showMoreItems() {
    this.paginationLimit = this.ListRatingAccount.length;
  }
  showLessItems() {
    this.paginationLimit = 5;
  }
  showMoreRatings() {
    this.paginationLimitRatings = this.ListRatingAccount.length;
  }
  showLessRatings() {
    this.paginationLimitRatings = 3;
  }

  // số lượng add tối đa chỉ được 10 mỗi quốn sản phẩm , tính luôn đã có trong giỏ
  //##2 khi số lượng đã 10 , ko nhấn change input , nhấn add to cart-->fail
  checkGetCountCakeDetailEqual10(id) {
    this.checkedAddCake = true;
    for (var i = 0; i < this.lengthCartCake; i++) {
      if (this.CartCake[i]._id == id) {
        this.countCakeDetailCur = this.CartCake[i].count;

        if (this.CartCake[i].count == 10) {
          //show alert
          this.checkedAddCake = false;
          //update lại số lượng
        }
      }
    }

  }

  //add to cart (CakeDetail,CountSelect)
  nameCakeShowOnModel = ""
  addToCart(selectedCake: Cake, form: Cake) {
    this.nameCakeShowOnModel = selectedCake.nameCake;
    this.checkedAddCake = true;
    var CartCake = [];    //lưu trữ bộ nhớ tạm cho localStorage "CartCake"
    var dem = 0;            //Vị trí thêm sản phẩm mới vào localStorage "CartCake" (nếu sản phẩm chưa tồn tại)
    var temp = 0;           // đánh dấu nếu đã tồn tại sản phẩm trong localStorage "CartCake" --> count ++
    // nếu localStorage "CartCake" không rỗng
    if (!form.count || form.count + this.countCakeDetailCur > 10) form.count = 1;
    // nếu số lượng nhập vào <=10 thì oke
    if (form.count <= 10) {
      if (localStorage.getItem('CartCake') != null) {
        //chạy vòng lặp để lưu vào bộ nhớ tạm ( tạo mảng cho Object)
        if (!form.count) form.count = 1;
        for (var i = 0; i < this.lengthCartCake; i++) {
          CartCake[i] = JSON.parse(localStorage.getItem("CartCake"))[i];
          // nếu id cake đã tồn tại trong  localStorage "CartCake"
          if (CartCake[i]._id == selectedCake._id) {
            temp = 1;  //đặt biến temp
            // nếu số lượng tối đa chỉ được 10 mỗi  sản phẩm , tính luôn đã có trong giỏ thì oke
            if (parseInt(CartCake[i].count) + form.count <= 10) {
              CartCake[i].count = parseInt(CartCake[i].count) + form.count;  //tăng giá trị count
              //cập nhật cartcake vào db
              this.putCartCakeDB(CartCake[i]);
            }
            else {
              if (this.countCakeDetailCur == 10) {
                //show alert
                this.checkedAddCake = false;
                //update lại số lượng
                this.alertMessage = "Đã tồn tại 10 sản phẩm " + CartCake[i].nameCake + " trong giỏ hàng";
                this.alertFalse = true;
                setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
              }
            }
          }
          dem++;  // đẩy vị trí gán tiếp theo
        }
      }
      if (temp != 1) {      // nếu sản phẩm chưa có ( temp =0 ) thì thêm sản phẩm vào

        selectedCake.count = form.count;  // set count cho sản phẩm
        CartCake[dem] = selectedCake; // thêm sản phẩm vào vị trí "dem" ( vị trí cuối)
        //lưu cartcake vào db
        this.postCartCakeDB(selectedCake);

      }
      localStorage.setItem("CartCake", JSON.stringify(CartCake));
    }
    this.ngOnInit();
  }
  //continueShopping
  goToHome() {
    this._router.navigate(['/homePage']);
  }
  // go to cart cake
  goToCartCake() {
    this._router.navigate(['/cartCake']);
  }
  clickAddCakeOnModel(selectedCake: Cake) {
    this.nameCakeShowOnModel = selectedCake.nameCake;
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
  }
  clickGoToCakeDetail(id) {
    // this.cartCakeLength(this.CartCake);
    //set value giỏ hàng trên thanh head
    // this.getTotalCountAndPrice();
    // this.getCakeById(id);
    // this.getAllAccount();
    // this.getRatingsByCakeID(id);
    // this.getAllUsers();
    // this.getRatinng(id);
    // this.DataSetRecommend(id,0,0,1);
    this.idCake= id
    this.ngOnInit()
    return this._router.navigate(["/cakeDetail" + '/' +id]);


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
  getRatingByCake: any

  DataSetRecommend(cakeId,buy,rate,view){
    if(this.accountSocial!=null){
      this.datasetRecommend.userID = this.accountSocial._id;
      this.datasetRecommend.cakeID = cakeId;
      //các value == 0 trừ click xem = 1  ...--> vào trong backend sẽ tự cộng
      this.datasetRecommend.buy =buy ;
      this.datasetRecommend.rate=rate;
      this.datasetRecommend.click=view;
      console.log(this.datasetRecommend)
      this._datasetRecommend.putOrPostDatasetRecommend(this.datasetRecommend).subscribe(
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
