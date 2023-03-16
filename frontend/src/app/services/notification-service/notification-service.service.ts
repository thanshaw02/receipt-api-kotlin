import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ReceiptError, ReceiptSuccess, SnackbarSeverity } from "src/app/model";
import { NotificationSnackbarComponent } from "../../components";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }
  
  public setNotification(
    snackBar: MatSnackBar, 
    message: ReceiptError | ReceiptSuccess,
    severity: SnackbarSeverity = SnackbarSeverity.Error, // defaults to the "error" severity
  ): void {
    snackBar.openFromComponent(NotificationSnackbarComponent, {
      verticalPosition: "top",
      // duration: 5000,
      data: {
        message: message,
        severity: severity,
      },
    });
  }
}
