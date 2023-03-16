import { TestBed } from '@angular/core/testing';

import { ReceiptApiService } from './receipt-api.service';

describe('ReceiptApiService', () => {
  let service: ReceiptApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
