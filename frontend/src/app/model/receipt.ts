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

export default Receipt;