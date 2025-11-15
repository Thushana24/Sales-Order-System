export interface Client {
  clientId: number;
  clientName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Item {
  itemId: number;
  itemCode: string;
  description: string;
  unitPrice: number;
}

export interface SalesOrderDetail {
  salesOrderDetailId: number;
  salesOrderId: number;
  itemId: number;
  itemCode: string;
  itemDescription: string;
  note: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  exclAmount: number;
  taxAmount: number;
  inclAmount: number;
}

export interface SalesOrder {
  salesOrderId: number;
  orderNumber: string;
  orderDate: string;
  clientId: number;
  clientName: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
  totalExclAmount: number;
  totalTaxAmount: number;
  totalInclAmount: number;
  orderDetails: SalesOrderDetail[];
}

export interface CreateSalesOrderDetail {
  itemId: number;
  note: string;
  quantity: number;
  taxRate: number;
}

export interface CreateSalesOrder {
  clientId: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
  orderDetails: CreateSalesOrderDetail[];
}

export interface UpdateSalesOrderDetail {
  salesOrderDetailId: number;
  itemId: number;
  note: string;
  quantity: number;
  taxRate: number;
}

export interface UpdateSalesOrder {
  salesOrderId: number;
  clientId: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
  orderDetails: UpdateSalesOrderDetail[];
}

export interface SalesOrderState {
  orders: SalesOrder[];
  currentOrder: SalesOrder | null;
  loading: boolean;
  error: string | null;
}

export interface LineTotal {
  exclAmount: number;
  taxAmount: number;
  inclAmount: number;
}

export interface OrderTotals {
  totalExcl: number;
  totalTax: number;
  totalIncl: number;
}
