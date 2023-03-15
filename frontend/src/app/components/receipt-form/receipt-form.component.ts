import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Receipt } from 'src/app/model';
import { ReceiptApiService } from "../../services";

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form.component.html',
  styleUrls: ['./receipt-form.component.css']
})
export class ReceiptFormComponent {

  constructor(private receiptApiService: ReceiptApiService) { }

  public receiptForm = new FormGroup({
    retailerName: new FormControl(""),
    purchaseDate: new FormControl(""),
    purchaseTime: new FormControl(""),
    items: new FormControl([]), // this one will be interesting
    total: new FormControl("")
  });

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

    const total = this.receiptForm.value.total;
    if (!total) {
      console.warn("Total is missing from the form");
      return;
    }

    const receipt: Receipt = {
      retailer: retailer,
      purchaseDate: purchaseDate,
      purchaseTime: purchaseTime,
      items: [], //undefined, // leaving empty for now until I can get the items component working like it does in my React version
      total: total
    };
    return receipt;
  }
}
