import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CakeService } from 'src/app/app-services/cake-service/cake.service';
import { Cake } from 'src/app/app-services/cake-service/cake.model';
import { CategoryService } from 'src/app/app-services/category-service/category.service';
import { Category } from 'src/app/app-services/category-service/category.model';
import { SeriService } from 'src/app/app-services/seri-service/seri.service';
import { Seri } from 'src/app/app-services/seri-service/seri.model';

@Component({
  selector: 'app-admin-cake-details',
  templateUrl: './admin-cake-details.component.html',
  styleUrls: ['./admin-cake-details.component.css']
})
export class AdminCakeDetailsComponent implements OnInit {

  constructor(private _router: Router, private route: ActivatedRoute,private categoryService: CategoryService,
     private cakeService: CakeService, private seriService: SeriService) { }
     accountSocial = JSON.parse(localStorage.getItem("accountSocial"));

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getCakeById(id);
  }
 getCakeById(id:string) {
    this.cakeService.getCakeById(id).subscribe((res) => {
      this.cakeService.selectedCake = res as Cake;
      this.categoryService.getCategoryById(this.cakeService.selectedCake.categoryID).subscribe(category => {
        this.categoryService.category = category as Category;
        // this.authorService.getAuthorById(this.cakeService.selectedCake.authorID).subscribe(author => {
        //   this.authorService.author = author as Author;
        //   this.seriService.getSeriById(this.cakeService.selectedCake.seriID).subscribe(seri => {
        //     this.seriService.seri = seri as Seri;
        //   })
        // })
      })
    });
  }
  getCategoryList() {
    this.categoryService.getCategoryList().subscribe((res) => {
		  this.categoryService.categories = res as Category[];
		});
    }
    updateCakeById(cakeId) {
      return this._router.navigate(["/updateCake" + `/${cakeId}`]);
    }
    cancel(){
      this._router.navigate(['/manageCake'])
    }
     
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

}
