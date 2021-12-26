import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CakeCartPaymentComponent } from './cake-cart-payment.component';

describe('CakeCartPaymentComponent', () => {
  let component: CakeCartPaymentComponent;
  let fixture: ComponentFixture<CakeCartPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CakeCartPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CakeCartPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
