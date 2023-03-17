import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Observable, of } from "rxjs";
import { ReceiptError, ReceiptItem } from "src/app/model";
import { NotificationService } from "src/app/services";

@Component({
  selector: "app-receipt-item",
  templateUrl: "./receipt-item.component.html",
  styleUrls: ["./receipt-item.component.css"],
})
export class ReceiptItemComponent implements OnInit {
  public constructor(
    private notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    // decide which styling is needed based on if this ReceiptItem component is displaying an added item or the template
    this.inputFieldStyles = this.receiptItem ? "added-item-style" : "template-style";

    // set the boolean observable attribute that keeps track of whether or not the added receipt item is being edited
    // this.editingReceiptItem = of(!!this.receiptItem); // originally using an observable here
    this.editingReceiptItem = !!this.receiptItem;
  }

  // this is used for displaying an already added ReceiptItem
  @Input()
  public receiptItem?: ReceiptItem;

  // observable used between this component and parent component (ReceiptItemListComponent)
  // this emits when a new ReceiptItem is created/add
  @Output()
  public receiptItemEmitter = new EventEmitter<ReceiptItem>();
  
  // keeps track of a ReceiptItem and if it is being edited or not
  // public editingReceiptItem: Observable<boolean> = new Observable<boolean>(); // originally using an observable here
  public editingReceiptItem: boolean = false;

  // keeps track of the styling needed on the input fields
  public inputFieldStyles: string = "";

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

  public editReceiptItem(): void {
    // this.editingReceiptItem = of(!this.editingReceiptItem); // originally using an observable here
    this.editingReceiptItem = !this.editingReceiptItem;
  }
}
