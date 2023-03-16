import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Receipt, ReceiptItem } from 'src/app/model';
import { ReceiptApiService } from "../../services";

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form.component.html',
  styleUrls: ['./receipt-form.component.css']
})
export class ReceiptFormComponent {

  constructor(private receiptApiService: ReceiptApiService) { }

  // receipt fields
  public receiptItems: Array<ReceiptItem> = [];
  public total = "0.00";
  public receiptForm = new FormGroup({
    retailerName: new FormControl(""),
    purchaseDate: new FormControl(""),
    purchaseTime: new FormControl(""),
  });

  // binding between array of ReceiptItem's in child component (ReceiptItemList) and this component
  public updateReceiptItems(receiptItem: ReceiptItem): void {
    const summedTotal = (+this.total + (+receiptItem.price)).toString();
    this.total = parseFloat(summedTotal).toFixed(2);
    this.receiptItems.push(receiptItem)
  }

  public submitForm(): void {
    const possibleReceipt = this.isFormValid();
    if (!possibleReceipt) {
      return;
    }
    
    this.receiptApiService.processReceipt(possibleReceipt).subscribe(
      (receiptId) => {
        console.log(`\nReceiptIdResponse:\n${JSON.stringify(receiptId)}\n`);
      }
    );
  }

  private isFormValid(): Receipt | undefined {
    const retailer = this.receiptForm.value.retailerName;
    if (!retailer) {
      console.warn("Retailer name is missing from form");
      return;
    }

    const purchaseDate = this.receiptForm.value.purchaseDate;
    if (!purchaseDate) {
      console.warn("Purchase date is missing from form");
      return;
    }

    const purchaseTime = this.receiptForm.value.purchaseTime;
    if (!purchaseTime) {
      console.warn("Purchase time is missing from the form");
      return;
    }

    if (!this.receiptItems.length) {
      console.warn("No items have been added to the receipt");
      return;
    }

    const receipt: Receipt = {
      retailer: retailer,
      purchaseDate: purchaseDate,
      purchaseTime: purchaseTime,
      items: this.receiptItems,
      total: this.total
    };
    return receipt;
  }
}
