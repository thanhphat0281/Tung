import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CakeCartCusInfoComponent } from './cake-cart-cus-info.component';

describe('CakeCartCusInfoComponent', () => {
  let component: CakeCartCusInfoComponent;
  let fixture: ComponentFixture<CakeCartCusInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CakeCartCusInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CakeCartCusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
