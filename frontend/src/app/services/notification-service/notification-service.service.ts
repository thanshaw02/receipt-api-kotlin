import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ReceiptError, ReceiptSuccess, SnackbarSeverity } from "src/app/model";
import { NotificationSnackbarComponent } from "../../components";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public setNotification(
    snackBar: MatSnackBar, 
    message: ReceiptError | ReceiptSuccess,
    severity: SnackbarSeverity = SnackbarSeverity.Error, // defaults to the "error" severity
  ): void {
    snackBar.openFromComponent(NotificationSnackbarComponent, {
      verticalPosition: "top",
      duration: 5000, // if the user doesn't close the snackbar after 5 seconds it will close itself
      data: {
        message: message,
        severity: severity,
      },
    });
  }
  
}
