"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchSalesOrders,
  clearCurrentOrder,
} from "@/redux/slices/salesOrderSlice";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orders, loading, error } = useAppSelector(
    (state) => state.salesOrders,
  );

  useEffect(() => {
    dispatch(fetchSalesOrders());
  }, [dispatch]);

  const handleAddNew = () => {
    dispatch(clearCurrentOrder());
    router.push("/sales-order");
  };

  const handleRowDoubleClick = (orderId: number) => {
    router.push(`/sales-order/${orderId}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-xl text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-red-800">
            Error Loading Orders
          </h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => dispatch(fetchSalesOrders())}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition duration-200 hover:bg-red-700"
          >
            Retry
          </button>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Sales Order Management
              </h1>
              <p className="mt-1 text-gray-600">
                Manage and track all your sales orders in one place
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700"
              aria-label="Create new sales order"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Order
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Delivery City
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Total Excl
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Total Tax
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Total Incl
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="mb-4 h-16 w-16 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="mb-2 text-lg text-gray-500">
                          No orders found
                        </p>
                        <p className="text-sm text-gray-400">
                          Click "Add New Order" to create your first order
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.salesOrderId}
                      onDoubleClick={() =>
                        handleRowDoubleClick(order.salesOrderId)
                      }
                      className="cursor-pointer transition duration-150 hover:bg-gray-50"
                      title="Double-click to edit"
                    >
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-blue-600">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                        {order.clientName}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                        {order.deliveryCity || "-"}
                      </td>
                      <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-700">
                        {formatCurrency(order.totalExclAmount)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-700">
                        {formatCurrency(order.totalTaxAmount)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold whitespace-nowrap text-gray-900">
                        {formatCurrency(order.totalInclAmount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        {orders.length > 0 && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start">
              <svg
                className="mt-0.5 mr-3 h-5 w-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Tip:</span> Double-click on
                  any order row to view or edit the order details.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
