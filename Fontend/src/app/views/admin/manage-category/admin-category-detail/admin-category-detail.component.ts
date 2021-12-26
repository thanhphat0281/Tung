import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CakeService } from 'src/app/app-services/cake-service/cake.service';
import { Cake } from 'src/app/app-services/cake-service/cake.model';
import { CategoryService } from 'src/app/app-services/category-service/category.service';
import { Category } from 'src/app/app-services/category-service/category.model';


@Component({
  selector: 'app-admin-category-detail',
  templateUrl: './admin-category-detail.component.html',
  styleUrls: ['./admin-category-detail.component.css']
})
export class AdminCategoryDetailComponent implements OnInit {

  constructor(private _router: Router, private route: ActivatedRoute,private categoryService: CategoryService,
     private cakeService: CakeService) { }
     accountSocial = JSON.parse(localStorage.getItem("accountSocial"));

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getCategoryById(id);
  }
  category:any
  getCategoryById(id:string) {
      this.categoryService.getCategoryById(id).subscribe(category => {
        this.category = category as Category;
    });
  }

    updateCategoryById(categoryId) {
      return this._router.navigate(["/updateCategory" + `/${categoryId}`]);
    }
    cancel(){
      this._router.navigate(['/manageCategory'])
    }
     
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

}
