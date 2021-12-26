import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CakeDetailComponent } from './cake-detail.component';

describe('CakeDetailComponent', () => {
  let component: CakeDetailComponent;
  let fixture: ComponentFixture<CakeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CakeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CakeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
