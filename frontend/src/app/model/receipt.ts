export type ReceiptPointsResponse = {
  points: string;
};

export type ReceiptIdResponse = {
  id: string;
};

export type ReceiptItem = {
  shortDescription: string;
  price: string;
};

type Receipt = {
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items?: Array<ReceiptItem>;
  total: string;
};

// source of truth for error strings used through the project
export enum ReceiptError {
  MissingRetailer = "Retailer name is missing from the form",
  MissingPurchaseDate = "Purchase date is missing from the form",
  MissingPurchaseTime = "Purchase time is missing from the form",
  MissingReceiptItems = "No items have been added to the receipt",
  MissingItemDescription = "Please enter a short description of the receipt item",
  MissingItemPrice = "Please enter a price for the receipt item",
  ReceiptSubmissionError = "There was an error submitting the receipt",
};

export default Receipt;