import { useMemo } from "react";
import type { Item, LineTotal, OrderTotals } from "@/types";

interface OrderDetailForm {
  itemId: number | "";
  quantity: number;
  taxRate: number;
}

/**
 * Custom hook for order calculations
 * Memoized for performance optimization
 */
export const useOrderCalculations = (
  orderDetails: OrderDetailForm[],
  items: Item[],
) => {
  // Calculate line total for a single item
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

  // Calculate order totals (memoized)
  const orderTotals = useMemo((): OrderTotals => {
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
  }, [orderDetails, items]);

  return {
    calculateLineTotal,
    orderTotals,
  };
};
