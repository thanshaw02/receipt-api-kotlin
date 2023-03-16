import { Component, EventEmitter, Output } from '@angular/core';
import { ReceiptItem } from 'src/app/model';

@Component({
  selector: 'app-receipt-item-list',
  templateUrl: './receipt-item-list.component.html',
  styleUrls: ['./receipt-item-list.component.css']
})
export class ReceiptItemListComponent {
  // @Output()
  // public receiptItems = new EventEmitter<Array<ReceiptItem>>();

  public receiptItems: Array<ReceiptItem> = [];

  public addNewReceiptItem(receiptItem: ReceiptItem) {
    this.receiptItems.push(receiptItem);
    console.log(`ReceiptItems so far:\n${this.receiptItems}`);
  }
}
