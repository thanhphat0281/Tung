import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/app-services/user-service/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/app-services/user-service/user.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Cake } from 'src/app/app-services/cake-service/cake.model';
import { CakeService } from 'src/app/app-services/cake-service/cake.service';
import { CategoryService } from 'src/app/app-services/category-service/category.service';
import { Category } from 'src/app/app-services/category-service/category.model';
import { SeriService } from 'src/app/app-services/seri-service/seri.service';
import { Seri } from 'src/app/app-services/seri-service/seri.model';

@Component({
  selector: 'app-admin-manage-cake',
  templateUrl: './admin-manage-cake.component.html',
  styleUrls: ['./admin-manage-cake.component.css']
})
export class AdminManageCakeComponent implements OnInit {
  statusCRUD: String = ""
  displayedColumns: string[] = ['imgCake', 'empty1', 'nameCake', 'priceCake', 'empty2', 'Details', 'Edit', 'Delete'];
  // dataSource: MatTableDataSource<Cake>;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private _router: Router, private cakeService: CakeService,
    private seriService: SeriService, private userService: UserService, private categoryService: CategoryService) {

  }
  accountSocial = JSON.parse(localStorage.getItem("accountSocial"));
  ngOnInit() {
    this.refreshCakesList();

    // this.getNameCategory();
  }
  refreshCakesList1() {
    this.cakeService.getCakeList().subscribe((res) => {
      this.cakeService.cake = res as Cake[];

    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCakeById(cakeId) {
    return this._router.navigate(["/cakeDetails" + `/${cakeId}`]);
  }
  updateCakeById(cakeId) {
    return this._router.navigate(["/updateCake" + `/${cakeId}`]);
  }

  cakes: any
  listCake = [];
  refreshCakesList() {
    this.cakeService.getCakeList().subscribe((res) => {
      this.cakes = res;
      this.dataSource.data = this.cakes;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  // for (let i = 0; i < this.cakes.length; i++) {
  //   this.categoryService.getCategoryById(this.cakes[i].categoryID).subscribe(category => {
  //     this.authorService.getAuthorById(this.cakes[i].authorID).subscribe(author => {
  //       this.seriService.getSeriById(this.cakes[i].seriID).subscribe(series => {
  //         var info = {
  //           _id: this.cakes[i]._id, nameCake: this.cakes[i].nameCake,
  //           nameCategory: (category as Category).nameCategory, nameAuthor: (author as Author).nameAuthor,
  //           priceCake: this.cakes[i].priceCake,
  //           imgCake: this.cakes[i].imgCake, nameSeries: (series as Seri).nameSeri, sale: this.cakes[i].sale
  //         };
  //         this.listCake.push(info);
  //         console.log(this.listCake)
  //         this.dataSource.data = this.listCake;
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       })
  //     })
  //   })
  // }
  alertId(data) {
    console.log(data);
  }
  alertSuccess: boolean = false;
  alertMessage: string = "";
  deleteCakeById(_id: string) {
    if (confirm('Bạn có muốn xóa sản phẩm này không ?') == true) {
      this.cakeService.deleteCake(_id).subscribe(
        data => {
          console.log(data);
          this.ngOnInit();
          this.alertSuccess = true;
          this.alertMessage = "Xóa Thông Tin Sản Phẩm Thành Công!";
          setTimeout(() => {
          this.alertSuccess = false;
            this.alertMessage = "";
          }, 2000);
        },
        error => console.log(error)
      )
    }
  }
  insertUser() {
    this._router.navigate(['/insertUser']);
  }
  addCake() {
    this._router.navigate(['/insertCake']);
  }
   
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

}
