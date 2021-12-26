

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CakeService } from '../../../../app-services/cake-service/cake.service';
import { CategoryService } from '../../../../app-services/category-service/category.service';
import { Category } from '../../../../app-services/category-service/category.model';
import { Seri} from '../../../../app-services/seri-service/seri.model';
import { SeriService } from '../../../../app-services/seri-service/seri.service';
declare var $:any;
@Component({
  selector: 'app-insert-category',
  templateUrl: './insert-category.component.html',
  styleUrls: ['./insert-category.component.css']
})
export class InsertCategoryComponent implements OnInit {
  statusInsert:Boolean = false;
  accountSocial = JSON.parse(localStorage.getItem("accountSocial"));

  countryForm: FormGroup;
  // countries = ['USA', 'Canada', 'Uk']
  constructor(private _router:Router,  private cakeService:CakeService, 
    private fb: FormBuilder,private categoryService: CategoryService, private seriService : SeriService) {
    $(function() {
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
    });
  }
  
  ngOnInit() {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
    this.resetForm();

 
  }
  category:any
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.category = {
      _id: null,
      nameCategory:"",
      imgCategory: "",
      detailCategory: "",
    };
  }
    cancel(){
      this._router.navigate(['/manageCategory']);
    }
    onSubmit(form: NgForm) {
      console.log(form.value)
          this.categoryService.postCategory(form.value).subscribe(
            data => {console.log(data);this._router.navigate(['/manageCategory']);
          this.statusInsert = true;
        },
            error => console.log(error)
           );
    }
    getLinkImgCategory="";
    getLinkImg(event : any)
    { 
      this.getLinkImgCategory=event.target.value;

    }
     
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

}
