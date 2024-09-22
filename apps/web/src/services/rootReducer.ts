import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import clientReducer from './clientSlice';
// Import the product slice
import orderReducer from './orderSlice';
import productReducer from './productSlice';

// Import the order slice

const rootReducer = combineReducers({
  auth: authReducer,
  client: clientReducer,
  product: productReducer, // Add the product reducer here
  order: orderReducer, // Add the order reducer here
});

export default rootReducer;
