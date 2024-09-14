export type InitOrderPayload = {
  clientId: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    paidQuantity: number; // Use paidQuantity instead of paid
  }[];
};
