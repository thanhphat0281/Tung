import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NpnSliderModule } from "npn-slider";
import { ChartsModule } from 'ng2-charts';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'ng4-social-login';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AuthInterceptorService } from './app-services/auth-service/auth-interceptor.service';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AgmDirectionModule } from 'agm-direction'; 
import { FileUploadModule } from 'ng2-file-upload';
import {
  AgmCoreModule
} from '@agm/core';
import { SafePipeModule } from 'safe-pipe';


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('125307089096-0onp79tfpp4nbkip5hec87m5p38lhqm0.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('5505856986106329')
  }
], false);
// Import the library
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

export function provideConfig() {
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    CustomerLayoutComponent,
    AdminLayoutComponent
            ],
  imports: [
    Ng4LoadingSpinnerModule.forRoot(),
    SafePipeModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CarouselModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NpnSliderModule,
    SocialLoginModule,
    Ng2SearchPipeModule,
    ChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCe_mxr_DVquWPgI13cjQdQfEHefMgw5Uo',
      libraries: ['places']
    }),
    NgxImageZoomModule,
    AgmDirectionModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }],
  bootstrap: [AppComponent]
})

export class AppModule { }
