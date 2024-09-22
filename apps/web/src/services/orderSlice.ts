import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from './store';

// Define the order product interface
interface OrderProduct {
  id: string;
  quantity: number;
  orderId: string;
  productId: string;
}

interface InitOrderProduct {
  productId: string;
  quantity: number;
}

// Define the client interface
interface Client {
  id: string;
  name: string;
  phone: string;
}

interface InitOrder {
  clientId: string;
  userId: string;
  handedAmount: number;
  products: InitOrderProduct[];
}

// Define the order interface
interface Order {
  id: string;
  clientId: string;
  userId: string;
  totalAmount: number;
  handedAmount: number;
  restToPay: number;
  createdAt: string;
  updatedAt: string;
  orderProducts: OrderProduct[];
  client: Client;
}

// Define the state interface
interface OrderState {
  loading: boolean;
  error: string | null;
  orders: Order[];
  order: Order | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  filters: {
    date?: string;
    restToPay?: number;
    search?: string;
  };
}

// Initial state
const initialState: OrderState = {
  loading: false,
  error: null,
  orders: [],
  order: null,
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  filters: {},
};

// Async thunks

// Initialize Order
export const initializeOrder = createAsyncThunk(
  'order/init',
  async (payload: InitOrder, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/init`, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to initialize order');
    }
  },
);

// Make Partial Payment
export const makePartialPayment = createAsyncThunk(
  'order/pay',
  async (payload: { orderId: string; handedAmount: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/pay`, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to process payment');
    }
  },
);

// Get Orders with pagination and filters
export const getOrders = createAsyncThunk(
  'order/getOrders',
  async (
    params: { page: number; limit: number; date?: string; restToPay?: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
        params, // Passing query parameters for pagination and filters
      });
      return response.data; // Assuming the API returns { orders, totalCount, totalPages, currentPage }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  },
);

// Get Order by ID
export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order');
    }
  },
);

// Mark Order as Delivered
export const markOrderAsDelivered = createAsyncThunk(
  'order/markAsDelivered',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orders/deliver/${orderId}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to mark order as delivered');
    }
  },
);

// Order Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setFilters(
      state,
      action: PayloadAction<{ date?: string; restToPay?: number; search?: string }>,
    ) {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Order Cases
      .addCase(initializeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(initializeOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create order';
      })

      // Make Partial Payment Cases
      .addCase(makePartialPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(makePartialPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the specific order/payment state here
      })
      .addCase(makePartialPayment.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to process payment';
      })

      // Get Orders Cases
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.orders = []; // Clear the orders to avoid showing stale data
      })
      .addCase(
        getOrders.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: Order[];
            totalCount: number;
            totalPages: number;
            currentPage: number;
          }>,
        ) => {
          state.loading = false;
          state.orders = action.payload.orders; // Update the orders list
          state.totalCount = action.payload.totalCount; // Update total count
          state.totalPages = action.payload.totalPages; // Update total pages
          state.currentPage = action.payload.currentPage; // Update current page
        },
      )
      .addCase(getOrders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      })

      // Get Order by ID Cases
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.order = action.payload; // Store the fetched order
      })
      .addCase(getOrderById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      })

      // Mark Order as Delivered Cases
      .addCase(markOrderAsDelivered.pending, (state) => {
        state.loading = true;
      })
      .addCase(markOrderAsDelivered.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the orders list or perform other updates here
      })
      .addCase(markOrderAsDelivered.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to mark order as delivered';
      });
  },
});

// Actions
export const { setFilters } = orderSlice.actions;

// Selectors
export const selectOrders = (state: RootState) => state.order.orders;
export const selectOrder = (state: RootState) => state.order.order;
export const selectTotalCount = (state: RootState) => state.order.totalCount;
export const selectTotalPages = (state: RootState) => state.order.totalPages;
export const selectCurrentPage = (state: RootState) => state.order.currentPage;
export const selectFilters = (state: RootState) => state.order.filters;

export default orderSlice.reducer;
