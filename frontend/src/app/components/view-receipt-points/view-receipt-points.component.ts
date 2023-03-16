import { Component, Inject, OnInit } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { Observable, of } from "rxjs";
import { ReceiptApiService } from "../../services";

@Component({
  selector: "app-view-receipt-points",
  templateUrl: "./view-receipt-points.component.html",
  styleUrls: ["./view-receipt-points.component.css"]
})
export class ViewReceiptPointsComponent implements OnInit {
  public receiptPoints$?: Observable<string>;

  public constructor(
    private receiptApi: ReceiptApiService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public receiptId: string,
  ) {}

  public ngOnInit(): void {
    this.receiptApi.getReceiptPoints(this.receiptId).subscribe(
      (receiptPoints) => {
        console.log(`Receipt points accrued: ${receiptPoints.points}`);
        this.receiptPoints$ = of(receiptPoints.points);
      },
      (err) => {
        console.error(`Error fetching receipt points by id ${this.receiptId} -- ${err}`);
      }
    );
  }
}
