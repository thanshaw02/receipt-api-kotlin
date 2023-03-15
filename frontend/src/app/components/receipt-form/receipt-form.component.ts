import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form.component.html',
  styleUrls: ['./receipt-form.component.css']
})
export class ReceiptFormComponent {
  public receiptForm = new FormGroup({
    retailerName: new FormControl(""),
    purchaseDate: new FormControl(""),
    purchaseTime: new FormControl(""),
    items: new FormControl([]), // this one will be interesting
    total: new FormControl("")
  });

  public submitForm(): void {
    // console.log(`Retailer name FormControl: ${this.retailerName.value}`);
    console.log(this.receiptForm.value)
  }
}
