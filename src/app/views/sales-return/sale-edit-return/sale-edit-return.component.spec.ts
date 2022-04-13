/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SaleEditReturnComponent } from './sale-edit-return.component';

describe('SaleEditReturnComponent', () => {
  let component: SaleEditReturnComponent;
  let fixture: ComponentFixture<SaleEditReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleEditReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleEditReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
