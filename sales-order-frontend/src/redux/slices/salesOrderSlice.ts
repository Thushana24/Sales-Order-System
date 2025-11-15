import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  SalesOrder,
  SalesOrderState,
  CreateSalesOrder,
  UpdateSalesOrder,
} from "@/types";
import { createSalesOrder, deleteSalesOrder, getAllSalesOrders, getSalesOrderById, updateSalesOrder } from "@/services";


// Initial state
const initialState: SalesOrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSalesOrders = createAsyncThunk<SalesOrder[]>(
  "salesOrders/fetchAll",
  async () => {
    const response = await getAllSalesOrders();
    return response;
  },
);

export const fetchSalesOrderById = createAsyncThunk<SalesOrder, number>(
  "salesOrders/fetchById",
  async (id: number) => {
    const response = await getSalesOrderById(id);
    return response;
  },
);

export const addSalesOrder = createAsyncThunk<SalesOrder, CreateSalesOrder>(
  "salesOrders/add",
  async (orderData: CreateSalesOrder) => {
    const response = await createSalesOrder(orderData);
    return response;
  },
);

export const editSalesOrder = createAsyncThunk<SalesOrder, UpdateSalesOrder>(
  "salesOrders/edit",
  async (orderData: UpdateSalesOrder) => {
    const response = await updateSalesOrder(orderData.salesOrderId, orderData);
    return response;
  },
);

export const removeSalesOrder = createAsyncThunk<number, number>(
  "salesOrders/remove",
  async (id: number) => {
    await deleteSalesOrder(id);
    return id;
  },
);

// Slice
const salesOrderSlice = createSlice({
  name: "salesOrders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchSalesOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSalesOrders.fulfilled,
        (state, action: PayloadAction<SalesOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
        },
      )
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      // Fetch order by ID
      .addCase(fetchSalesOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSalesOrderById.fulfilled,
        (state, action: PayloadAction<SalesOrder>) => {
          state.loading = false;
          state.currentOrder = action.payload;
        },
      )
      .addCase(fetchSalesOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch order";
      })
      // Add order
      .addCase(addSalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addSalesOrder.fulfilled,
        (state, action: PayloadAction<SalesOrder>) => {
          state.loading = false;
          state.orders.unshift(action.payload);
        },
      )
      .addCase(addSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create order";
      })
      // Edit order
      .addCase(editSalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editSalesOrder.fulfilled,
        (state, action: PayloadAction<SalesOrder>) => {
          state.loading = false;
          const index = state.orders.findIndex(
            (o) => o.salesOrderId === action.payload.salesOrderId,
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
        },
      )
      .addCase(editSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update order";
      })
      // Remove order
      .addCase(removeSalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeSalesOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.orders = state.orders.filter(
            (o) => o.salesOrderId !== action.payload,
          );
        },
      )
      .addCase(removeSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete order";
      });
  },
});

export const { clearCurrentOrder, clearError } = salesOrderSlice.actions;
export default salesOrderSlice.reducer;
