import { Component, Inject, inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackbarData } from "../../model";

@Component({
  selector: 'app-notification-snackbar',
  templateUrl: './notification-snackbar.component.html',
  styleUrls: ['./notification-snackbar.component.css']
})
export class NotificationSnackbarComponent {
  public snackBarRef = inject(MatSnackBarRef);

  public constructor(
    @Inject(MAT_SNACK_BAR_DATA) public snackBarData: SnackbarData
  ) { }
}
