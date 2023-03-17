// Basic Angular imports
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";

// Angular MUI imports
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";

// Project imports
import { AppRoutingModule } from "./app-routing/index";
import { AppComponent } from "./app.component";
import {
  NotificationSnackbarComponent,
  ReceiptFormComponent,
  ReceiptItemComponent,
  ReceiptItemListComponent,
  ViewReceiptPointsComponent,
} from "./components/index";

@NgModule({
  declarations: [
    AppComponent,
    NotificationSnackbarComponent,
    ReceiptFormComponent,
    ReceiptItemComponent,
    ReceiptItemListComponent,
    ViewReceiptPointsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatDividerModule,
    MatSnackBarModule,
    MatBottomSheetModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
