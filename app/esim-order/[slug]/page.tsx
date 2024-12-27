import { Metadata } from "next";

import BackButton from "@/components/app/BackButton";

export async function generateMetadata({
  params,
}: {
  params: { orderId: string };
}): Promise<Metadata> {
  return {
    title: `Order Confirmation - ${params.orderId} | LN-SIM`,
    description: `Confirmation for your eSIM purchase. Order ID: ${params.orderId}`,
  };
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;
  const orderDetails = null;
  const loading = false;

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <p>Loading order details...</p>
      </main>
    );
  }

  if (!orderDetails) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Order Not Found</h1>
        <div className="mt-4">
          <BackButton />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
      <p className="mb-2">Order ID: {orderId}</p>
      <p className="mb-4">Plan: {orderDetails.planName}</p>
      <p className="mb-4">Amount Paid: ${orderDetails.amount.toFixed(2)}</p>
      <div className="mt-4">
        <BackButton />
      </div>
    </main>
  );
}
