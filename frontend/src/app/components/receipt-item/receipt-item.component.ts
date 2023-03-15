import { 
  Component, 
  EventEmitter,
  Input,
  Output 
} from '@angular/core';
import { ReceiptItem } from 'src/app/model';

@Component({
  selector: 'app-receipt-item',
  templateUrl: './receipt-item.component.html',
  styleUrls: ['./receipt-item.component.css']
})
export class ReceiptItemComponent {

  // this is used for displaying an already added ReceiptItem
  @Input() public receiptItem?: ReceiptItem;

  constructor() {
    console.log(`ReceiptItem on init: ${JSON.stringify(this.receiptItem)}`);
  }

  // this emits when a new ReceiptItem is created/add
  @Output() public receiptItemEmitter = new EventEmitter<ReceiptItem>();

  public addReceiptItem(shortDescription: string, price: string): void {
    // emites the newly created ReceiptItem to the parent component "ReceiptItemList"
    this.receiptItemEmitter.emit({
      shortDescription: shortDescription,
      price: price
    });
  }
}
