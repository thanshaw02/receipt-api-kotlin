// Basic Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular MUI imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from "@angular/material/form-field"
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

// Project component imports
import { AppRoutingModule } from './app-routing/index';
import { AppComponent } from './app.component';
import { 
  ReceiptFormComponent,
} from './components/index';
import { ReceiptItemListComponent } from './components/receipt-item-list/receipt-item-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ReceiptFormComponent,
    ReceiptItemListComponent
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
    MatGridListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
