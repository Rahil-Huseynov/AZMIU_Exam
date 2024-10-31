import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  id: string;
  productName: string;
  orderDate: string;
  orderAmount: number;
  totalPrice: number;
}

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
