const demoOrders = new Map([
  ["ORD-1001", { id: "ORD-1001", status: "processing", item: "Cloud Runner", total: "$89.00" }],
  ["ORD-2002", { id: "ORD-2002", status: "shipped", item: "Trail Pack", total: "$64.00" }]
]);

export function createOrderTool() {
  return {
    getOrder(orderId) {
      const order = demoOrders.get(orderId);
      return order && { ...order };
    },
    cancelOrder(orderId) {
      const order = demoOrders.get(orderId);
      if (!order || order.status !== "processing") return null;

      order.status = "cancelled";
      return { orderId, action: "order_cancelled", message: `Order ${orderId} has been cancelled.` };
    }
  };
}
