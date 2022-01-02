import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerLayoutRoutes } from './customer-layout.routing';
import { HomeComponent } from 'src/app/views/customer/home/home.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NpnSliderModule } from "npn-slider";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CakeCategoryComponent } from 'src/app/views/customer/cake-category/cake-category.component';
import { CakeDetailComponent } from 'src/app/views/customer/cake-detail/cake-detail.component';
import { MyAccountComponent } from 'src/app/auth/my-account/my-account.component';
import { LoginComponent} from '../../auth/login/login.component';
import { RegisterComponent} from '../../auth/register/register.component';
import { LostPasswordComponent } from 'src/app/views/customer/lost-password/lost-password.component';
import { CakeCartComponent } from 'src/app/views/customer/cake-cart/cake-cart.component';
import { AboutUsComponent } from 'src/app/views/customer/about-us/about-us.component';
import { ProfileDetailComponent } from 'src/app/views/customer/profile-detail/profile-detail.component';
import { AccountProfileComponent } from 'src/app/views/customer/account-profile/account-profile.component';
import { OrderHistoryComponent } from 'src/app/views/customer/order-history/order-history.component';
import { CakeCartCusInfoComponent } from 'src/app/views/customer/cake-cart-cus-info/cake-cart-cus-info.component';
import { CakeCartPaymentComponent } from 'src/app/views/customer/cake-cart-payment/cake-cart-payment.component';
import { ProfileDetailEditComponent } from 'src/app/views/customer/profile-detail-edit/profile-detail-edit.component';
import { ProfileChangePasswordComponent } from 'src/app/views/customer/profile-change-password/profile-change-password.component';
import { ProfileAccountSocialComponent } from 'src/app/views/customer/profile-account-social/profile-account-social.component';
import { DiscountCodeComponent } from 'src/app/views/customer/discount-code/discount-code.component';
import { FavoriteComponent } from 'src/app/views/customer/favorite/favorite.component';
import { SaleComponent } from 'src/app/views/customer/sale/sale.component';
import { AgmCoreModule } from '@agm/core';

import { AgmDirectionModule } from 'agm-direction'; 
import { SafePipeModule } from 'safe-pipe';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ConfirmEmailComponent } from 'src/app/views/customer/confirm-email/confirm-email.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { PageShowListComponent } from 'src/app/views/customer/page-show-list/page-show-list.component';
import { Navlv2Component } from 'src/app/views/customer/navlv2/navlv2.component';
import { Page404NotFoundComponent } from 'src/app/views/customer/page404-not-found/page404-not-found.component';

@NgModule({
  imports: [
    Ng4LoadingSpinnerModule,
    SafePipeModule,
    CommonModule,
    RouterModule.forChild(CustomerLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NpnSliderModule,
    CarouselModule,
    NgxImageZoomModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB-wq5GKz5nbc0CMjPWzqHyl4vZmzFoz7c',
      libraries: ['places']
    }),
    AgmDirectionModule
    ],
  declarations: [
    HomeComponent,
    CakeCategoryComponent,
    CakeDetailComponent,
    MyAccountComponent,
    LoginComponent,
    RegisterComponent,
    LostPasswordComponent,
    CakeCartComponent,
    AboutUsComponent,
    ProfileDetailComponent,
    AccountProfileComponent,
    OrderHistoryComponent,
    CakeCartCusInfoComponent,
    CakeCartPaymentComponent,
    ProfileDetailEditComponent,
    ProfileChangePasswordComponent,
    ProfileAccountSocialComponent,
    DiscountCodeComponent,
    ConfirmEmailComponent,
    FavoriteComponent,
    SaleComponent,
    PageShowListComponent,
    Navlv2Component,
    Page404NotFoundComponent
  ]
})

export class CustomerLayoutModule {}
