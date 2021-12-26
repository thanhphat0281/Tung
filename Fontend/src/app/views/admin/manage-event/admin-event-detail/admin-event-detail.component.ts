import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CakeService } from '../../../../app-services/cake-service/cake.service';
import { CategoryService } from '../../../../app-services/category-service/category.service';
import { AuthorService } from '../../../../app-services/author-service/author.service';
import { Category } from '../../../../app-services/category-service/category.model';
import { Author } from '../../../../app-services/author-service/author.model';
import { Seri } from '../../../../app-services/seri-service/seri.model';
import { Promotion } from '../../../../app-services/promotion-service/promotion.model';
import { SeriService } from '../../../../app-services/seri-service/seri.service';
import { PromotionService } from 'src/app/app-services/promotion-service/promotion.service';
declare var $: any;
@Component({
  selector: 'app-admin-event-detail',
  templateUrl: './admin-event-detail.component.html',
  styleUrls: ['./admin-event-detail.component.css']
})
export class AdminEventDetailComponent implements OnInit {
  statusInsert: Boolean = false;
  accountSocial = JSON.parse(localStorage.getItem("accountSocial"));

  countryForm: FormGroup;
  // countries = ['USA', 'Canada', 'Uk']
  constructor(private _router: Router, private cakeService: CakeService, private route: ActivatedRoute,
    private fb: FormBuilder, private categoryService: CategoryService,
    private authorService: AuthorService, private seriService: SeriService, private promotionService: PromotionService) {
    $(function () {
      $(document).ready(function () {
        $("#selectCategory").change(function () {
          var selectedVal = $("#selectCategory option:selected").val();
          alert(selectedVal);
        });
        $("#selectAuthor").change(function () {
          var selectedVal = $("#selectAuthor option:selected").val();
          alert(selectedVal);
        });
      });
    });
  }
  id = this.route.snapshot.paramMap.get('id');
  ngOnInit() {
    this.resetForm();
  

    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
    this.getPromotionByID(this.id)



  }
  promotion: any
  alertMessage = "";
  alertSucess = false;
  alertFalse = false;
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.promotion = {
      _id: null,
      headerPromotion: "",
      imgPromotion: "",
      detailPromotion: "",
      discount: null,
      ifDiscount: null,
      startDate: "",
      endDate: "",
      listCakeIn: null,
      isShow: "",
      addList: "",
    };
  }
  getPromotionByID(id){
    this.promotionService.getPromotionById(id).subscribe(promo =>{
      this.promotion = promo as Promotion
      this.mindateStart= this.promotion['startDate'].split(" ")[0]
      this.mindateEnd=this.promotion['endDate'].split(" ")[0]
      this.minTimeStart= this.promotion['startDate'].split(" ")[1]
      this.minTimeEnd=this.promotion['endDate'].split(" ")[1]
      this.getLinkImgCategory= this.promotion['imgPromotion']
      if(   this.promotion.isShow=="false"){
        this.promotion.isShow=false
      }else{
        this.promotion.isShow=true
      }
     
      if(this.promotion.listCakeIn[0] !="")
      {
        this.IscheckListID=2
        this.promotion.addList=true
        this.checkListID(this.promotion.listCakeIn)
      }
    })
  }
  checkListID(event){

    this.cakeService.CheckExistListCakeID(event).subscribe(data=>{
      this.checkTrueFalseCakeID = data 
      this.dataTrue=this.checkTrueFalseCakeID["trueData"]
      this.dataFalse=this.checkTrueFalseCakeID["falseData"]
      this.arrayListCake=this.checkTrueFalseCakeID["array"]
      if(this.checkTrueFalseCakeID["falseData"].length!=0){
        this.IscheckListID=1
          return false
      }
      this.IscheckListID=2
      return true
    })
  }
  cancel() {
    this._router.navigate(['/manageEvent']);
  }

  onSubmit(form: NgForm) {
 
  }
  getLinkImgCategory = "";
  getLinkImg(event: any) {
    this.getLinkImgCategory = event.target.value;

  }

  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }


  //check validate

  // Xử lý thao tác
  IsSmallImg = true;
  IsBigImg = false;
  IsAveraImg = false;
  radioImgSmall() {
    this.IsSmallImg = true;
    this.IsAveraImg = false;
    this.IsBigImg = false;
  }
  radioImgAvera() {
    this.IsSmallImg = false;
    this.IsAveraImg = true;
    this.IsBigImg = false;
  }
  radioImgBig() {
    this.IsSmallImg = false;
    this.IsAveraImg = false;
    this.IsBigImg = true;
  }
  TimeStart: any
  DateStart: any
  TimeEnd: any
  DateEnd: any
  mindateStart: any
  mindateEnd: any
  minTimeStart: any
  minTimeEnd: any



  //kiểm tra các id sản phẩm có đúng ko 
  checkTrueFalseCakeID:any
  IscheckListID=0
  dataTrue:any
  dataFalse:any
  arrayListCake:any


  gotoUpdate(){
    return this._router.navigate(["/updateEvent" + `/${this.id}`]);
  }
}
