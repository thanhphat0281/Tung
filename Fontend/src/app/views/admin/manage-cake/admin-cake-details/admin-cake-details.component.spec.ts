import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCakeDetailsComponent } from './admin-cake-details.component';

describe('AdminCakeDetailsComponent', () => {
  let component: AdminCakeDetailsComponent;
  let fixture: ComponentFixture<AdminCakeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCakeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCakeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
