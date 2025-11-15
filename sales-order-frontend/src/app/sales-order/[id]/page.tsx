"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { editSalesOrder } from "@/redux/slices/salesOrderSlice";
import { getAllClients, getAllItems, getSalesOrderById } from "@/services/api";
import type {
  Client,
  Item,
  UpdateSalesOrderDetail,
  OrderTotals,
  LineTotal,
} from "@/types";

interface OrderDetailForm extends UpdateSalesOrderDetail {}

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

  // Order State
  const [orderData, setOrderData] = useState({
    salesOrderId: 0,
    clientId: 0,
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPostalCode: "",
    deliveryCountry: "",
  });

  // Order Details State
  const [orderDetails, setOrderDetails] = useState<OrderDetailForm[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, itemsData, orderResponse] = await Promise.all([
          getAllClients(),
          getAllItems(),
          getSalesOrderById(orderId),
        ]);

        setClients(clientsData);
        setItems(itemsData);

        setOrderData({
          salesOrderId: orderResponse.salesOrderId,
          clientId: orderResponse.clientId,
          deliveryAddress: orderResponse.deliveryAddress,
          deliveryCity: orderResponse.deliveryCity,
          deliveryPostalCode: orderResponse.deliveryPostalCode,
          deliveryCountry: orderResponse.deliveryCountry,
        });

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
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Error loading data. Please try again.");
        router.push("/");
      }
    };
    loadData();
  }, [orderId, router]);

  // Handle client selection
  const handleClientChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const clientId = parseInt(e.target.value);
    const selectedClient = clients.find((c) => c.clientId === clientId);

    if (selectedClient) {
      setOrderData({
        ...orderData,
        clientId: clientId,
        deliveryAddress: selectedClient.address,
        deliveryCity: selectedClient.city,
        deliveryPostalCode: selectedClient.postalCode,
        deliveryCountry: selectedClient.country,
      });
    } else {
      setOrderData({
        ...orderData,
        clientId: 0,
        deliveryAddress: "",
        deliveryCity: "",
        deliveryPostalCode: "",
        deliveryCountry: "",
      });
    }
  };

  // Add new line item
  const handleAddItem = () => {
    setOrderDetails([
      ...orderDetails,
      {
        salesOrderDetailId: 0,
        itemId: 0,
        note: "",
        quantity: 1,
        taxRate: 0,
      },
    ]);
  };

  // Remove line item
  const handleRemoveItem = (index: number) => {
    const newDetails = orderDetails.filter((_, i) => i !== index);
    setOrderDetails(newDetails);
  };

  // Update line item
  const handleDetailChange = (
    index: number,
    field: keyof OrderDetailForm,
    value: string | number,
  ) => {
    const newDetails = [...orderDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setOrderDetails(newDetails);
  };

  // Handle item code selection
  const handleItemCodeChange = (index: number, itemId: string) => {
    const newDetails = [...orderDetails];
    newDetails[index].itemId = itemId ? parseInt(itemId) : 0;
    setOrderDetails(newDetails);
  };

  // Calculate line totals
  const calculateLineTotal = (detail: OrderDetailForm): LineTotal => {
    if (!detail.itemId || !detail.quantity) {
      return { exclAmount: 0, taxAmount: 0, inclAmount: 0 };
    }

    const item = items.find((i) => i.itemId === detail.itemId);
    if (!item) {
      return { exclAmount: 0, taxAmount: 0, inclAmount: 0 };
    }

    const exclAmount = detail.quantity * item.unitPrice;
    const taxAmount = (exclAmount * detail.taxRate) / 100;
    const inclAmount = exclAmount + taxAmount;

    return { exclAmount, taxAmount, inclAmount };
  };

  // Calculate order totals
  const calculateOrderTotals = (): OrderTotals => {
    let totalExcl = 0;
    let totalTax = 0;
    let totalIncl = 0;

    orderDetails.forEach((detail) => {
      const lineTotals = calculateLineTotal(detail);
      totalExcl += lineTotals.exclAmount;
      totalTax += lineTotals.taxAmount;
      totalIncl += lineTotals.inclAmount;
    });

    return { totalExcl, totalTax, totalIncl };
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!orderData.clientId) {
      alert("Please select a customer");
      setSubmitting(false);
      return;
    }

    if (orderDetails.length === 0) {
      alert("Please add at least one item");
      setSubmitting(false);
      return;
    }

    const invalidDetails = orderDetails.some(
      (d) => !d.itemId || !d.quantity || d.quantity <= 0,
    );
    if (invalidDetails) {
      alert("Please fill all item details correctly");
      setSubmitting(false);
      return;
    }

    const submitData = {
      salesOrderId: orderData.salesOrderId,
      clientId: orderData.clientId,
      deliveryAddress: orderData.deliveryAddress,
      deliveryCity: orderData.deliveryCity,
      deliveryPostalCode: orderData.deliveryPostalCode,
      deliveryCountry: orderData.deliveryCountry,
      orderDetails: orderDetails.map(
        (detail): UpdateSalesOrderDetail => ({
          salesOrderDetailId: detail.salesOrderDetailId,
          itemId: detail.itemId,
          note: detail.note,
          quantity: detail.quantity,
          taxRate: detail.taxRate,
        }),
      ),
    };

    try {
      await dispatch(editSalesOrder(submitData)).unwrap();
      alert("Order updated successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error saving order. Please try again.");
      setSubmitting(false);
    }
  };

  const totals = calculateOrderTotals();
  const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-xl text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              Edit Sales Order
            </h1>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-lg bg-gray-500 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-gray-600"
            >
              Back to Home
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Customer Information
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="customer"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Customer Name *
                </label>
                <select
                  id="customer"
                  value={orderData.clientId || ""}
                  onChange={handleClientChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Customer</option>
                  {clients.map((client) => (
                    <option key={client.clientId} value={client.clientId}>
                      {client.clientName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Delivery Address
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={orderData.deliveryAddress}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      deliveryAddress: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={orderData.deliveryCity}
                  onChange={(e) =>
                    setOrderData({ ...orderData, deliveryCity: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="postalCode"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={orderData.deliveryPostalCode}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      deliveryPostalCode: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={orderData.deliveryCountry}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      deliveryCountry: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Order Items
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-green-700"
              >
                Add Item
              </button>
            </div>

            {orderDetails.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No items. Click "Add Item" to start.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Item Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Note
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Tax Rate %
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Excl Amount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Tax Amount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Incl Amount
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {orderDetails.map((detail, index) => {
                      const lineTotals = calculateLineTotal(detail);
                      return (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <select
                              value={detail.itemId}
                              onChange={(e) =>
                                handleItemCodeChange(index, e.target.value)
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Select Item</option>
                              {items.map((item) => (
                                <option key={item.itemId} value={item.itemId}>
                                  {item.itemCode}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={detail.itemId}
                              onChange={(e) =>
                                handleItemCodeChange(index, e.target.value)
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Select Description</option>
                              {items.map((item) => (
                                <option key={item.itemId} value={item.itemId}>
                                  {item.description}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={detail.note}
                              onChange={(e) =>
                                handleDetailChange(
                                  index,
                                  "note",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                              placeholder="Note"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={detail.quantity}
                              onChange={(e) =>
                                handleDetailChange(
                                  index,
                                  "quantity",
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                              min="1"
                              required
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={detail.taxRate}
                              onChange={(e) =>
                                handleDetailChange(
                                  index,
                                  "taxRate",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-700">
                            {formatCurrency(lineTotals.exclAmount)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-700">
                            {formatCurrency(lineTotals.taxAmount)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                            {formatCurrency(lineTotals.inclAmount)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="font-semibold text-red-600 hover:text-red-800"
                              aria-label="Remove item"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Order Totals */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Order Totals
            </h2>
            <div className="flex justify-end">
              <div className="w-full space-y-2 md:w-1/3">
                <div className="flex items-center justify-between border-b py-2">
                  <span className="font-medium text-gray-700">
                    Total Excl Amount:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totals.totalExcl)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b py-2">
                  <span className="font-medium text-gray-700">
                    Total Tax Amount:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totals.totalTax)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded bg-blue-50 px-4 py-2">
                  <span className="font-bold text-gray-800">
                    Total Incl Amount:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(totals.totalIncl)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              disabled={submitting}
              className="rounded-lg bg-gray-500 px-8 py-3 font-semibold text-white transition duration-200 hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                "Update Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
