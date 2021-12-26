

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
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {
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
   this.getCategoryByID(id);
    this.resetForm();
  }
  category:any
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.category = {
      _id: "",
      nameCategory:"",
      imgCategory: "",
      detailCategory: "",
    }
  }
  getCategoryByID(id:string) {
    this.categoryService.getCategoryById(id).subscribe((res) => {
      this.category = res as Category;
    });
  }
    cancel(){
      this.location.back();
        }
    alertMessage: string = ""
    onSubmit(form: NgForm) {
        if (confirm('Bạn có muốn cập nhật thể loại này không ?') == true) {
          // form.value.imgMonAn =  $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');
          let id = this.route.snapshot.paramMap.get('id');
        form.value._id = id;
        form.value.quantity=100;
        this.categoryService.putCategory(form.value).subscribe(
         data => {console.log(data);
          this.alertSucess = true;
          this.alertMessage = "Cập Nhật Thông Tin Thể Loại Thành Công!";
          setTimeout(() => {  this.alertSucess = false;
            this.alertMessage = "";this._router.navigate(['/manageCategory']); },2000);
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
