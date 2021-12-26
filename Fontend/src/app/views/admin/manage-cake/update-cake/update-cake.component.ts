import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CakeService } from '../../../../app-services/cake-service/cake.service';
import { NgForm } from '@angular/forms';
import { Cake } from '../../../../app-services/cake-service/cake.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CategoryService } from '../../../../app-services/category-service/category.service';
import { Category } from '../../../../app-services/category-service/category.model';
import { SeriService } from 'src/app/app-services/seri-service/seri.service';
import { Seri } from 'src/app/app-services/seri-service/seri.model';
import { Location } from '@angular/common';
declare var $:any;
@Component({
  selector: 'app-update-cake',
  templateUrl: './update-cake.component.html',
  styleUrls: ['./update-cake.component.css']
})
export class UpdateCakeComponent implements OnInit {
  id_cake: string;
  alertSucess: boolean = false;
  selectedValue = '';
  countryForm: FormGroup;
  categories = [];
  event : any;
  accountSocial = JSON.parse(localStorage.getItem("accountSocial"));

  // countries = ['USA', 'Canada', 'Uk']
  constructor(private _router:Router,  private cakeService:CakeService, private seriService: SeriService,private location: Location,
    private fb: FormBuilder,private categoryService: CategoryService, private route: ActivatedRoute) {
      $(document).ready(function() {
        $("#selectCategory").change(function() {
          var selectedVal = $("#selectCategory option:selected").val();
          alert(selectedVal);
        });
        $("#selectAuthor").change(function() {
          var selectedVal = $("#selectAuthor option:selected").val();
          alert(selectedVal);
        });
    
      });

     }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    console.log(id);
   this.getCakeById(id);
   this.getSeriesList();
    // var id = localStorage.getItem('idCategory');
    this.resetForm();
    // this.getCakeListById('5e5b3e2d7c63981214d8fc90');
    this.getCategoryList();
  
  }
  
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.cakeService.selectedCake = {
      _id: "",
      nameCake:"",
      categoryID: "",     
      priceCake: null,
      detailCake: "",   
      imgCake: "",     
      sale: null,
      count: null,
      quantity:null,
      rate:null,
    }
  }
  getCakeCategoryById(id:string) {
    this.categoryService.getCategoryById(id).subscribe((res) => {
      this.categoryService.categories = res as Category[];
      console.log(res);
    });
  }
  getCakeById(id:string) {
    this.cakeService.getCakeById(id).subscribe((res) => {
      this.cakeService.selectedCake = res as Cake;
      console.log(res)
    });
  }
  getSeriesList(){
    this.seriService.getSeriList().subscribe(seri => {
      this.seriService.seri = seri as Seri;
    })
  }
  getCategoryList() {
    this.categoryService.getCategoryList().subscribe((res) => {
		  this.categoryService.categories = res as Category[];
		});
    }
    cancel(){
      this.location.back();
        }
    alertMessage: string = ""
    onSubmit(form: NgForm) {
        if (confirm('Bạn có muốn cập nhật sản phẩm này không ?') == true) {
          // form.value.imgMonAn =  $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');
          let id = this.route.snapshot.paramMap.get('id');
        form.value._id = id;
       
        this.cakeService.putCake(form.value).subscribe(
         data => {console.log(data);
          this.alertSucess = true;
          this.alertMessage = "Cập Nhật Thông Tin Sản Phẩm Thành Công!";
          setTimeout(() => {  this.alertSucess = false;
            this.alertMessage = "";this._router.navigate(['/manageCake']); },2000);
        },
         error => console.log(error)
        );
      console.log('Your form data: '+  form.value._id)
    }
    }
    getLinkImgCake="";
    getLinkImg(event : any)
    { 
      this.getLinkImgCake=event.target.value;

    }
     
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

}
