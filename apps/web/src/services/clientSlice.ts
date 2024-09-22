import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from './store';

interface Client {
  id: string;
  name: string;
  phone: string;
}

interface createClientPayload {
  name: string;
  phone: string;
}
interface FetchClientsParams {
  skip: number;
  take: number;
}

interface ClientState {
  loading: boolean;
  error: string | null;
  clients: Client[];
  client: Client | null;
}

const initialState: ClientState = {
  loading: false,
  error: null,
  clients: [],
  client: null,
};

// Async Thunks
export const fetchClients = createAsyncThunk(
  'client/fetchAll',
  async ({ skip, take }: FetchClientsParams) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/client`, {
      params: { skip, take },
    });
    return response.data;
  },
);
export const fetchClientById = createAsyncThunk('client/fetchById', async (id: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/client/${id}`);
  return response.data;
});

export const createClient = createAsyncThunk(
  'client/create',
  async (client: createClientPayload) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/client`, client);
    return response.data;
  },
);

export const updateClient = createAsyncThunk('client/update', async (client: Client) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/client/${client.id}`,
    client,
  );
  return response.data;
});

export const deleteClient = createAsyncThunk('client/delete', async (id: string) => {
  await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/clients/${id}`);
  return id;
});

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch clients';
      })
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientById.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.client = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch client';
      })
      .addCase(createClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.clients.push(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create client';
      })
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        const index = state.clients.findIndex((client) => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update client';
      })
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.clients = state.clients.filter((client) => client.id !== action.payload);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete client';
      });
  },
});

// Selectors
export const selectClients = (state: RootState) => state.client.clients;
export const selectClient = (state: RootState) => state.client.client;

export default clientSlice.reducer;
