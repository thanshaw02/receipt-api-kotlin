import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import {
  Receipt,
  ReceiptIdResponse,
  ReceiptPointsResponse,
} from "../../model";

@Injectable({
  providedIn: "root",
})
export class ReceiptApiService {
  private API_URL = "http://localhost:8000";
  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  public constructor(private http: HttpClient) {}

  public processReceipt(
    receipt: Receipt
  ): Observable<ReceiptIdResponse> {
    return this.http
      .post<ReceiptIdResponse>(
        `${this.API_URL}/receipts/process`,
        receipt,
        this.httpOptions
      )
      .pipe(
        tap((id) =>
          console.log(
            `Receipt ID from processing receipt: ${JSON.stringify(
              id
            )}`
          )
        ),
        catchError(
          this.handleError<ReceiptIdResponse>("processReceipt")
        )
      );
  }

  public getReceiptPoints(
    id: string
  ): Observable<ReceiptPointsResponse> {
    return this.http
      .get<ReceiptPointsResponse>(
        `${this.API_URL}/receipts/${id}/points`
      )
      .pipe(
        tap((points) =>
          console.log(
            `Receipt points by id "${id}": ${JSON.stringify(points)}`
          )
        ),
        catchError(
          this.handleError<ReceiptPointsResponse>("getReceiptPoints")
        )
      );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
