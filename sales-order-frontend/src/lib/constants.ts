export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const ROUTES = {
  HOME: "/",
  NEW_ORDER: "/sales-order",
  EDIT_ORDER: (id: number) => `/sales-order/${id}`,
} as const;

export const MESSAGES = {
  SUCCESS: {
    ORDER_CREATED: "Order created successfully!",
    ORDER_UPDATED: "Order updated successfully!",
    ORDER_DELETED: "Order deleted successfully!",
  },
  ERROR: {
    LOAD_DATA: "Error loading data. Please try again.",
    SAVE_ORDER: "Error saving order. Please try again.",
    DELETE_ORDER: "Error deleting order. Please try again.",
    NETWORK: "Network error. Please check your connection.",
  },
  VALIDATION: {
    SELECT_CUSTOMER: "Please select a customer",
    ADD_ITEMS: "Please add at least one item",
    FILL_DETAILS: "Please fill all item details correctly",
  },
} as const;

export const TABLE_COLUMNS = {
  ORDER_NUMBER: "Order Number",
  ORDER_DATE: "Order Date",
  CUSTOMER: "Customer",
  DELIVERY_CITY: "Delivery City",
  TOTAL_EXCL: "Total Excl",
  TOTAL_TAX: "Total Tax",
  TOTAL_INCL: "Total Incl",
} as const;
