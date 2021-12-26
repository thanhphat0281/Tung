import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertCakeComponent } from './insert-cake.component';

describe('InsertCakeComponent', () => {
  let component: InsertCakeComponent;
  let fixture: ComponentFixture<InsertCakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertCakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertCakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
