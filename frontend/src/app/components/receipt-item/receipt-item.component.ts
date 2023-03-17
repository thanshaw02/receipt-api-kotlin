import {
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { ReceiptError, ReceiptItem } from "src/app/model";
import { NotificationService } from "src/app/services";

@Component({
  selector: "app-receipt-item",
  templateUrl: "./receipt-item.component.html",
  styleUrls: ["./receipt-item.component.css"],
})
export class ReceiptItemComponent {
  public constructor(
    private notificationService: NotificationService,
  ) {}

  // this is used for displaying an already added ReceiptItem
  @Input()
  public receiptItem?: ReceiptItem;

  // observable used between this component and parent component (ReceiptItemListComponent)
  // this emits when a new ReceiptItem is created/add
  @Output()
  public receiptItemEmitter = new EventEmitter<ReceiptItem>();

  public addReceiptItem(
    shortDescription: string,
    price: string
  ): void {
    if (!shortDescription) {
      this.notificationService.setNotification(
        ReceiptError.MissingItemDescription
      );
    } else if (!price) {
      this.notificationService.setNotification(
        ReceiptError.MissingItemPrice
      );
    } else {
      // emites the newly created ReceiptItem to the parent component "ReceiptItemList"
      this.receiptItemEmitter.emit({
        shortDescription: shortDescription,
        price: price,
      });
    }
  }
}
