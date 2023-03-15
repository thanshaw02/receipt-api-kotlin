import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptItemListComponent } from './receipt-item-list.component';

describe('ReceiptItemListComponent', () => {
  let component: ReceiptItemListComponent;
  let fixture: ComponentFixture<ReceiptItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptItemListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
