import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatters";
import type { OrderTotals as OrderTotalsType } from "@/types";

interface OrderTotalsProps {
  totals: OrderTotalsType;
}

const OrderTotals = ({ totals }: OrderTotalsProps) => {
  return (
    <Card title="Order Totals">
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
            <span className="font-medium text-gray-700">Total Tax Amount:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totals.totalTax)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded bg-blue-50 px-4 py-2">
            <span className="font-bold text-gray-800">Total Incl Amount:</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(totals.totalIncl)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderTotals;
