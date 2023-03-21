import { Component, EventEmitter, Output } from "@angular/core";
import { ReceiptItem } from "../../model";

@Component({
  selector: "app-receipt-item-list",
  templateUrl: "./receipt-item-list.component.html",
  styleUrls: ["./receipt-item-list.component.css"],
})
export class ReceiptItemListComponent {
  // observable used between this component and parent component (ReceiptFormComponent)
  // used to add to the ReceiptItem array in the ReceiptFormComponent to eventually be sent to the backend
  @Output()
  public receiptItemsEmitter = new EventEmitter<ReceiptItem>();

  // this is not great, having two seperate emitters, one for adding a new ReceiptItem and this one for editing a single ReceiptItem
  @Output()
  public editReceiptItemEmitter = new EventEmitter<ReceiptItem>();

  // used to display the list of ReceiptItem's to the user
  public receiptItems: Array<ReceiptItem> = [];

  // binding between single added ReceiptItem from child component (ReceiptItemComponent) and this component
  public addNewReceiptItem(receiptItem: ReceiptItem): void {
    this.receiptItems.push(receiptItem);
    this.receiptItemsEmitter.emit(receiptItem);
  }

  public editReceiptItem(receiptItem: ReceiptItem): void {
    this.editReceiptItemEmitter.emit(receiptItem);
  }
}
