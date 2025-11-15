import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/formatters";
import type { Item, LineTotal } from "@/types";

interface OrderDetailForm {
  itemId: number | "";
  note: string;
  quantity: number;
  taxRate: number;
}

interface OrderItemsTableProps {
  orderDetails: OrderDetailForm[];
  items: Item[];
  calculateLineTotal: (detail: OrderDetailForm) => LineTotal;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (
    index: number,
    field: keyof OrderDetailForm,
    value: string | number,
  ) => void;
}

const OrderItemsTable = ({
  orderDetails,
  items,
  calculateLineTotal,
  onRemoveItem,
  onUpdateItem,
}: OrderItemsTableProps) => {
  if (orderDetails.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No items added yet. Click "Add Item" to start.</p>
      </div>
    );
  }

  return (
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
                      onUpdateItem(
                        index,
                        "itemId",
                        parseInt(e.target.value) || "",
                      )
                    }
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select</option>
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
                      onUpdateItem(
                        index,
                        "itemId",
                        parseInt(e.target.value) || "",
                      )
                    }
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select</option>
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
                      onUpdateItem(index, "note", e.target.value)
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
                      onUpdateItem(
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
                      onUpdateItem(
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
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onRemoveItem(index)}
                    type="button"
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;
