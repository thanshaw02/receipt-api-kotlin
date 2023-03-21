import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { v4 as uuid } from "uuid";
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
    this.inputFieldStyles = this.receiptItem
      ? "added-item-style"
      : "template-style";

    // this is bad logic, it works but i have a double negative i think which makes this hard to read
    // in the html the two input fields disabled state is set to the opposite of this.isEditing
    // so if this.isEditing === false then the fields are disabled, if this.isEditing === true then the fields are not disabled
    this.isEditing = this.receiptItem ? false : true;
  }

  // this is used for displaying an already added ReceiptItem
  @Input()
  public receiptItem?: ReceiptItem;

  // observable used between this component and parent component (ReceiptItemListComponent)
  // this emits when a new ReceiptItem is created/add
  @Output()
  public receiptItemEmitter = new EventEmitter<ReceiptItem>();

  @Output()
  public editReceiptItemEmitter = new EventEmitter<ReceiptItem>();

  // keeps track of a ReceiptItem and if it is being edited or not
  // public editingReceiptItem: Observable<boolean> = new Observable<boolean>(); // originally using an observable here
  public isEditing: boolean = true;

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
        id: uuid(),
        shortDescription: shortDescription,
        price: price,
      });
    }
  }

  public editReceiptItem(
    shortDescription: string,
    price: string
  ): void {
    if (!this.receiptItem || !shortDescription || !price) {
      this.notificationService.setNotification(
        ReceiptError.EditReceiptItemError
      );
      return;
    }

    const hasBeenEdited =
      this.receiptItem.shortDescription !== shortDescription ||
      this.receiptItem.price !== price;

    // if edits were made then we want to emit those changes up
    if (this.isEditing && hasBeenEdited) {
      this.receiptItem = {
        id: this.receiptItem.id,
        shortDescription: shortDescription,
        price: price,
      };
      this.editReceiptItemEmitter.emit(this.receiptItem);
    }

    this.isEditing = !this.isEditing;
  }
}
