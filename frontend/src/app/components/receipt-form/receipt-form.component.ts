import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ViewReceiptPointsComponent } from "../view-receipt-points/view-receipt-points.component";
import {
  ReceiptError,
  ReceiptSuccess,
  Receipt,
  ReceiptItem,
  SnackbarSeverity,
  ReceiptIdResponse,
} from "src/app/model";
import {
  NotificationService,
  ReceiptApiService,
} from "../../services";

@Component({
  selector: "app-receipt-form",
  templateUrl: "./receipt-form.component.html",
  styleUrls: ["./receipt-form.component.css"],
})
export class ReceiptFormComponent {
  constructor(
    private viewReceiptPointsSheet: MatBottomSheet,
    private notificationSnackBar: MatSnackBar,
    private receiptApiService: ReceiptApiService,
    private notificationService: NotificationService,
  ) {}

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
    const summedTotal = (+this.total + +receiptItem.price).toString();
    this.total = parseFloat(summedTotal).toFixed(2);
    this.receiptItems.push(receiptItem);
  }

  public submitForm(): void {
    try {
      const possibleReceipt = this.isFormValid();

      this.receiptApiService
        .processReceipt(possibleReceipt)
        .subscribe(
          (receiptId: ReceiptIdResponse) => {
            this.notificationService.setNotification(
              this.notificationSnackBar,
              ReceiptSuccess.ReceiptSubmission,
              SnackbarSeverity.Success
            );

            // display receipt accrued points via material UI bottom sheet
            this.viewReceiptPointsSheet.open(ViewReceiptPointsComponent, {
              data: receiptId.id
            });
          },
          (err) => {
            console.error(`Error posting receipt object -- ${err}`);
            this.notificationService.setNotification(
              this.notificationSnackBar,
              ReceiptError.ReceiptSubmissionError
            );
          }
        );
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      this.notificationService.setNotification(
        this.notificationSnackBar,
        e.message
      );
    }
  }

  private isFormValid(): Receipt {
    const retailer = this.receiptForm.value.retailerName;
    if (!retailer) {
      throw new Error(ReceiptError.MissingRetailer);
    }

    const purchaseDate = this.receiptForm.value.purchaseDate;
    if (!purchaseDate) {
      throw new Error(ReceiptError.MissingPurchaseDate);
    }

    const purchaseTime = this.receiptForm.value.purchaseTime;
    if (!purchaseTime) {
      throw new Error(ReceiptError.MissingPurchaseTime);
    }

    if (!this.receiptItems.length) {
      throw new Error(ReceiptError.MissingReceiptItems);
    }

    const receipt: Receipt = {
      retailer: retailer,
      purchaseDate: purchaseDate,
      purchaseTime: purchaseTime,
      items: this.receiptItems,
      total: this.total,
    };
    return receipt;
  }
}
