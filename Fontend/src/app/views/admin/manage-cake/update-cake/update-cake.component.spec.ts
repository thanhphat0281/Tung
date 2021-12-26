import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCakeComponent } from './update-cake.component';

describe('UpdateCakeComponent', () => {
  let component: UpdateCakeComponent;
  let fixture: ComponentFixture<UpdateCakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
