"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { editSalesOrder } from "@/redux/slices/salesOrderSlice";
import { getAllClients, getAllItems, getSalesOrderById } from "@/services";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import CustomerSection from "@/components/orders/CustomerSection";
import OrderItemsTable from "@/components/orders/OrderItemsTable";
import OrderTotals from "@/components/orders/OrderTotals";
import { validateOrderForm } from "@/lib/validators";
import { ROUTES, MESSAGES } from "@/lib/constants";
import type { Client, Item, UpdateSalesOrderDetail } from "@/types";

export default function EditSalesOrderPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const orderId = parseInt(params.id as string);

  // State
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salesOrderId, setSalesOrderId] = useState(0);

  // Custom hooks
  const {
    orderData,
    orderDetails,
    setOrderData,
    setOrderDetails,
    handleClientChange,
    addOrderItem,
    removeOrderItem,
    updateOrderItem,
    updateOrderData,
  } = useOrderForm();

  const { calculateLineTotal, orderTotals } = useOrderCalculations(
    orderDetails,
    items,
  );

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [clientsData, itemsData, orderResponse] = await Promise.all([
          getAllClients(),
          getAllItems(),
          getSalesOrderById(orderId),
        ]);

        setClients(clientsData);
        setItems(itemsData);
        setSalesOrderId(orderResponse.salesOrderId);

        // Set order data
        setOrderData({
          clientId: orderResponse.clientId,
          deliveryAddress: orderResponse.deliveryAddress,
          deliveryCity: orderResponse.deliveryCity,
          deliveryPostalCode: orderResponse.deliveryPostalCode,
          deliveryCountry: orderResponse.deliveryCountry,
        });

        // Set order details
        setOrderDetails(
          orderResponse.orderDetails.map((detail) => ({
            salesOrderDetailId: detail.salesOrderDetailId,
            itemId: detail.itemId,
            note: detail.note,
            quantity: detail.quantity,
            taxRate: detail.taxRate,
          })),
        );

        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(MESSAGES.ERROR.LOAD_DATA);
        setLoading(false);
      }
    };

    loadData();
  }, [orderId, setOrderData, setOrderDetails]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const validation = validateOrderForm({
      clientId: orderData.clientId,
      orderDetails: orderDetails.map((d) => ({
        itemId: d.itemId as number,
        quantity: d.quantity,
      })),
    });

    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }

    setSubmitting(true);

    // Prepare data
    const submitData = {
      salesOrderId,
      clientId: orderData.clientId,
      deliveryAddress: orderData.deliveryAddress,
      deliveryCity: orderData.deliveryCity,
      deliveryPostalCode: orderData.deliveryPostalCode,
      deliveryCountry: orderData.deliveryCountry,
      orderDetails: orderDetails.map(
        (detail): UpdateSalesOrderDetail => ({
          salesOrderDetailId: detail.salesOrderDetailId || 0,
          itemId: detail.itemId as number,
          note: detail.note,
          quantity: detail.quantity,
          taxRate: detail.taxRate,
        }),
      ),
    };

    try {
      await dispatch(editSalesOrder(submitData)).unwrap();
      alert(MESSAGES.SUCCESS.ORDER_UPDATED);
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error("Error updating order:", error);
      alert(MESSAGES.ERROR.SAVE_ORDER);
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading order details..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <ErrorMessage
          title="Error Loading Order"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Card
          title="Edit Sales Order"
          subtitle={`Order ID: ${salesOrderId}`}
          actions={<Button
            variant="secondary"
            onClick={() => router.push(ROUTES.HOME)}
            disabled={submitting}
          >
            Back to Home
          </Button>}
          className="mb-6" children={undefined}        >
          {/* Empty */}
        </Card>

        <form onSubmit={handleSubmit}>
          {/* Customer & Delivery */}
          <CustomerSection
            clients={clients}
            clientId={orderData.clientId}
            deliveryAddress={orderData.deliveryAddress}
            deliveryCity={orderData.deliveryCity}
            deliveryPostalCode={orderData.deliveryPostalCode}
            deliveryCountry={orderData.deliveryCountry}
            onClientChange={(id) => handleClientChange(id, clients)}
            onAddressChange={(field, value) =>
              updateOrderData(field as any, value)
            }
          />

          {/* Order Items */}
          <Card
            title="Order Items"
            actions={
              <Button
                variant="success"
                onClick={addOrderItem}
                type="button"
                disabled={submitting}
              >
                Add Item
              </Button>
            }
            className="mt-6"
          >
            <OrderItemsTable
              orderDetails={orderDetails}
              items={items}
              calculateLineTotal={calculateLineTotal}
              onRemoveItem={removeOrderItem}
              onUpdateItem={updateOrderItem}
            />
          </Card>

          {/* Totals */}
          <div className="mt-6">
            <OrderTotals totals={orderTotals} />
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push(ROUTES.HOME)}
              type="button"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" isLoading={submitting}>
              {submitting ? "Updating..." : "Update Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
