import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { HomeComponent } from './views/customer/home/home.component';
import { CakeCategoryComponent } from './views/customer/cake-category/cake-category.component';
import { CakeDetailComponent } from './views/customer/cake-detail/cake-detail.component';
import { MyAccountComponent } from './auth/my-account/my-account.component';
import { LostPasswordComponent } from './views/customer/lost-password/lost-password.component';
import { CakeCartComponent } from './views/customer/cake-cart/cake-cart.component';
import { InsertCakeComponent } from './views/admin/manage-cake/insert-cake/insert-cake.component';
import { UpdateCakeComponent } from './views/admin/manage-cake/update-cake/update-cake.component';
import { AboutUsComponent } from './views/customer/about-us/about-us.component';
import { AccountProfileComponent } from './views/customer/account-profile/account-profile.component';
import { OrderHistoryComponent } from './views/customer/order-history/order-history.component';
import { CakeCartCusInfoComponent } from './views/customer/cake-cart-cus-info/cake-cart-cus-info.component';
import { CakeCartPaymentComponent } from './views/customer/cake-cart-payment/cake-cart-payment.component';
import { ProfileDetailComponent } from './views/customer/profile-detail/profile-detail.component';
import { ProfileDetailEditComponent } from './views/customer/profile-detail-edit/profile-detail-edit.component';
import { ProfileChangePasswordComponent } from './views/customer/profile-change-password/profile-change-password.component';
import { ManageOrderComponent } from './views/admin/manage-order/manage-order.component';
import { ProfileAccountSocialComponent } from './views/customer/profile-account-social/profile-account-social.component';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'homePage',
    pathMatch: 'full',
  },
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./layouts/customer-layout/customer-layout.module').then(m => m.CustomerLayoutModule)
    }]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }]
  }
];

@NgModule({
  imports: [ CommonModule,
    BrowserModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
