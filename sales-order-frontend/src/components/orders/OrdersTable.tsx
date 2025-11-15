"use client";

import type { SalesOrder } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { TABLE_COLUMNS } from "@/lib/constants";

interface OrdersTableProps {
  orders: SalesOrder[];
  onOrderClick: (orderId: number) => void;
}

const OrdersTable = ({ orders, onOrderClick }: OrdersTableProps) => {
  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg
          className="mx-auto mb-4 h-16 w-16 text-gray-300"
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
        <p className="mb-2 text-lg text-gray-500">No orders found</p>
        <p className="text-sm text-gray-400">
          Click "Add New Order" to create your first order
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {Object.values(TABLE_COLUMNS).map((column) => (
              <th
                key={column}
                className={`px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase ${
                  column.includes("Total") ? "text-right" : ""
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {orders.map((order) => (
            <tr
              key={order.salesOrderId}
              onDoubleClick={() => onOrderClick(order.salesOrderId)}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
