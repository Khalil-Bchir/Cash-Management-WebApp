export type InitOrderPayload = {
  clientId: string;
  userId: string;
  handedAmount: number;
  products: {
    productId: string;
    quantity: number;
  }[];
};
