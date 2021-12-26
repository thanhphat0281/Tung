import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CakeCategoryComponent } from './cake-category.component';

describe('CakeCategoryComponent', () => {
  let component: CakeCategoryComponent;
  let fixture: ComponentFixture<CakeCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CakeCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CakeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
