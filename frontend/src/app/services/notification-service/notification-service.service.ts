import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }
  
  public setNotification(snackBar: MatSnackBar, message: string): void {
    snackBar.open(message, "Close", {
      verticalPosition: "top",
      duration: 5000, // the user can cancel the snackbar or it will close on its own after 5 seconds
    });
  }
}
