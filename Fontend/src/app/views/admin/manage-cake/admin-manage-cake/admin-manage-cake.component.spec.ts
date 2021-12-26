import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageCakeComponent } from './admin-manage-cake.component';

describe('AdminManageCakeComponent', () => {
  let component: AdminManageCakeComponent;
  let fixture: ComponentFixture<AdminManageCakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageCakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageCakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
