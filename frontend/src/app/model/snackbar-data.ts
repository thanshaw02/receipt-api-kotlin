type SnackbarData = {
  message: string;
  severity: SnackbarSeverity;
};

enum SnackbarSeverity {
  Success = "snackbar-success",
  Error = "snackbar-error",
}

enum ReceiptError {
  MissingRetailer = "Retailer name is missing from the form",
  MissingPurchaseDate = "Purchase date is missing from the form",
  MissingPurchaseTime = "Purchase time is missing from the form",
  MissingReceiptItems = "No items have been added to the receipt",
  MissingItemDescription = "Please enter a short description of the receipt item",
  MissingItemPrice = "Please enter a price for the receipt item",
  ReceiptSubmissionError = "There was an error submitting the receipt",
  EditReceiptItemError = "When editing an item the item must have a description and price",
  ReceiptItemNotFound = "You are attempting to edit a receipt item that doesn't exist",
  // NOTE: when adding new possible error messages for the MatSnackBar add them here
}

enum ReceiptSuccess {
  ReceiptSubmission = "Successfully submitted your receipt!",
  // NOTE: when adding new possible success messages for the MatSnackBar add them here
}

export {
  ReceiptError,
  ReceiptSuccess,
  SnackbarData,
  SnackbarSeverity,
};
