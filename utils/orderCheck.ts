const completedOrders: Record<string, { iccid: string }> = {};

// Helper to check if an order ID is in memory
export function getCompletedOrder(transactionId: string) {
  return completedOrders[transactionId];
}

// Helper to save a completed order
export function saveCompletedOrder(transactionId: string, iccid: string) {
  completedOrders[transactionId] = { iccid };
}
