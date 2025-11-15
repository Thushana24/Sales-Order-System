/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate required field
 */
export const isRequired = (value: string | number): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

/**
 * Validate order form
 */
export const validateOrderForm = (data: {
  clientId: number;
  orderDetails: Array<{ itemId: number; quantity: number }>;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.clientId || data.clientId === 0) {
    errors.push("Please select a customer");
  }

  if (!data.orderDetails || data.orderDetails.length === 0) {
    errors.push("Please add at least one item");
  }

  const invalidItems = data.orderDetails.some(
    (item) => !item.itemId || !item.quantity || item.quantity <= 0,
  );

  if (invalidItems) {
    errors.push("Please fill all item details correctly");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
