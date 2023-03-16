// Basic Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";

// Angular MUI imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from "@angular/material/form-field"
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Project component imports
import { AppRoutingModule } from './app-routing/index';
import { AppComponent } from './app.component';
import { ReceiptFormComponent } from './components/index';
import { ReceiptItemListComponent } from './components/receipt-item-list/receipt-item-list.component';
import { ReceiptItemComponent } from './components/receipt-item/receipt-item.component';
import { NotificationSnackbarComponent } from './components/notification-snackbar/notification-snackbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ReceiptFormComponent,
    ReceiptItemListComponent,
    ReceiptItemComponent,
    NotificationSnackbarComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
