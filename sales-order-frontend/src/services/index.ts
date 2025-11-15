import { clientsApi } from "./api/clients";
import { itemsApi } from "./api/items";
import { ordersApi } from "./api/orders";

// Export all API services
export { clientsApi } from "./api/clients";
export { itemsApi } from "./api/items";
export { ordersApi } from "./api/orders";

// Convenience exports
export const getAllClients = () => clientsApi.getAll();
export const getClientById = (id: number) => clientsApi.getById(id);

export const getAllItems = () => itemsApi.getAll();
export const getItemById = (id: number) => itemsApi.getById(id);

export const getAllSalesOrders = () => ordersApi.getAll();
export const getSalesOrderById = (id: number) => ordersApi.getById(id);
export const createSalesOrder = (data: any) => ordersApi.create(data);
export const updateSalesOrder = (id: number, data: any) =>
  ordersApi.update(id, data);
export const deleteSalesOrder = (id: number) => ordersApi.delete(id);
