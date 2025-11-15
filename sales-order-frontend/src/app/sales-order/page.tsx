"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { addSalesOrder } from "@/redux/slices/salesOrderSlice";
import { useOrderData } from "@/hooks/useOrderData";
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
import type { CreateSalesOrderDetail } from "@/types";

export default function NewSalesOrderPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Custom hooks
  const { clients, items, loading, error } = useOrderData();
  const {
    orderData,
    orderDetails,
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

    // Prepare data
    const submitData = {
      clientId: orderData.clientId,
      deliveryAddress: orderData.deliveryAddress,
      deliveryCity: orderData.deliveryCity,
      deliveryPostalCode: orderData.deliveryPostalCode,
      deliveryCountry: orderData.deliveryCountry,
      orderDetails: orderDetails.map(
        (detail): CreateSalesOrderDetail => ({
          itemId: detail.itemId as number,
          note: detail.note,
          quantity: detail.quantity,
          taxRate: detail.taxRate,
        }),
      ),
    };

    try {
      await dispatch(addSalesOrder(submitData)).unwrap();
      alert(MESSAGES.SUCCESS.ORDER_CREATED);
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error("Error saving order:", error);
      alert(MESSAGES.ERROR.SAVE_ORDER);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Card
          title="Create Sales Order"
          actions={<Button
            variant="secondary"
            onClick={() => router.push(ROUTES.HOME)}
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
              <Button variant="success" onClick={addOrderItem} type="button">
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
            >
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Save Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
