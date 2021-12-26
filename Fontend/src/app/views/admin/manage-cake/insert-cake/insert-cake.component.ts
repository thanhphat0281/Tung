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
  selector: 'app-insert-cake',
  templateUrl: './insert-cake.component.html',
  styleUrls: ['./insert-cake.component.css']
})
export class InsertCakeComponent implements OnInit {
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
    this.getCategoryList();
    this.getSeriList();
  }
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.cakeService.selectedCake = {
      _id: null,
      nameCake:"",
      categoryID: "",
      priceCake: null,
      detailCake: "",
      imgCake: "",
      sale: null,
      count: null,
      quantity:null,
      rate:null,
    };
  }
  getCategoryList() {
    this.categoryService.getCategoryList().subscribe((res) => {
      this.categoryService.categories = res as Category[];
    
		});
    }
    getSeriList() {
      this.seriService.getSeriList().subscribe((res) => {
        this.seriService.series = res as Seri[];
       
      });
    }
    cancel(){
      this._router.navigate(['/manageCake']);
    }
    onSubmit(form: NgForm) {
      console.log(form.value)
          this.cakeService.postCake(form.value).subscribe(
            data => {console.log(data);this._router.navigate(['/manageCake']);
          this.statusInsert = true;
        },
            error => console.log(error)
           );
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
