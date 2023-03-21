type ReceiptPointsResponse = {
  points: string;
};

type ReceiptIdResponse = {
  id: string;
};

type ReceiptItem = {
  id: string;
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

export {
  Receipt,
  ReceiptItem,
  ReceiptIdResponse,
  ReceiptPointsResponse,
};
