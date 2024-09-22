import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from './store';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CreateProductPayload {
  name: string;
  price: number;
}

interface ProductState {
  loading: boolean;
  error: string | null;
  products: Product[];
  product: Product | null;
}

const initialState: ProductState = {
  loading: false,
  error: null,
  products: [],
  product: null,
};

// Async Thunks
export const fetchProducts = createAsyncThunk('product/fetchAll', async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/product`);
  return response.data;
});

export const fetchProductById = createAsyncThunk('product/fetchById', async (id: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`);
  return response.data;
});

export const createProduct = createAsyncThunk(
  'product/create',
  async (product: CreateProductPayload) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/product`, product);
    return response.data;
  },
);

export const updateProduct = createAsyncThunk('product/update', async (product: Product) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.id}`,
    product,
  );
  return response.data;
});

export const deleteProduct = createAsyncThunk('product/delete', async (id: string) => {
  await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`);
  return id;
});

// Product Slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create product';
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.products = state.products.filter((product) => product.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

// Selectors
export const selectProducts = (state: RootState) => state.product.products;
export const selectProduct = (state: RootState) => state.product.product;

export default productSlice.reducer;
