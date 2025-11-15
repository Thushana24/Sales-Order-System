import { useState, useCallback } from "react";
import type { Client } from "@/types";

interface OrderFormData {
  clientId: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
}

interface OrderDetailForm {
  salesOrderDetailId?: number;
  itemId: number | "";
  note: string;
  quantity: number;
  taxRate: number;
}

/**
 * Custom hook for order form management
 */
export const useOrderForm = (
  initialOrder?: OrderFormData,
  initialDetails?: OrderDetailForm[],
) => {
  const [orderData, setOrderData] = useState<OrderFormData>(
    initialOrder || {
      clientId: 0,
      deliveryAddress: "",
      deliveryCity: "",
      deliveryPostalCode: "",
      deliveryCountry: "",
    },
  );

  const [orderDetails, setOrderDetails] = useState<OrderDetailForm[]>(
    initialDetails || [],
  );

  // Handle client selection with auto-fill
  const handleClientChange = useCallback(
    (clientId: number, clients: Client[]) => {
      const selectedClient = clients.find((c) => c.clientId === clientId);

      if (selectedClient) {
        setOrderData({
          clientId: clientId,
          deliveryAddress: selectedClient.address,
          deliveryCity: selectedClient.city,
          deliveryPostalCode: selectedClient.postalCode,
          deliveryCountry: selectedClient.country,
        });
      } else {
        setOrderData({
          clientId: 0,
          deliveryAddress: "",
          deliveryCity: "",
          deliveryPostalCode: "",
          deliveryCountry: "",
        });
      }
    },
    [],
  );

  // Add new order item
  const addOrderItem = useCallback(() => {
    setOrderDetails((prev) => [
      ...prev,
      {
        salesOrderDetailId: 0,
        itemId: "",
        note: "",
        quantity: 1,
        taxRate: 0,
      },
    ]);
  }, []);

  // Remove order item
  const removeOrderItem = useCallback((index: number) => {
    setOrderDetails((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Update order item field
  const updateOrderItem = useCallback(
    (index: number, field: keyof OrderDetailForm, value: string | number) => {
      setOrderDetails((prev) => {
        const newDetails = [...prev];
        newDetails[index] = { ...newDetails[index], [field]: value };
        return newDetails;
      });
    },
    [],
  );

  // Update order data field
  const updateOrderData = useCallback(
    (field: keyof OrderFormData, value: string | number) => {
      setOrderData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  return {
    orderData,
    orderDetails,
    setOrderData,
    setOrderDetails,
    handleClientChange,
    addOrderItem,
    removeOrderItem,
    updateOrderItem,
    updateOrderData,
  };
};
