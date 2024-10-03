"use client";

import * as React from "react";
import { Button } from "../../ui/button";
import { QRCodeSVG } from "qrcode.react";
import { KeyInput } from "@/components/ui/VPN/KeyInput";
import { IoCopyOutline } from "react-icons/io5";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaInfoCircle } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import { Label } from "@radix-ui/react-select";

interface Order {
  orderId: string;
  payreq: string;
}

interface OrderStatusProps {
  order: Order;
  orderStatus: any;
  cancelOrder: () => void;
  error?: string | null;
}

export default function OrderStatus({
  order,
  orderStatus,
  cancelOrder,
}: OrderStatusProps) {
  const [copiedPayreq, setCopiedPayreq] = React.useState(false);
  const [copiedNumber, setCopiedNumber] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(false);

  const handleCopyPayreq = () => {
    navigator.clipboard.writeText(order.payreq);
    setCopiedPayreq(true);
    setTimeout(() => setCopiedPayreq(false), 2000);
  };

  const handleCopyNumber = () => {
    if (orderStatus && orderStatus.number) {
      navigator.clipboard.writeText(orderStatus.number.toString());
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (orderStatus && orderStatus.code) {
      navigator.clipboard.writeText(orderStatus.code.toString());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (orderStatus && orderStatus.error) {
    // Display the error message from the API
    return (
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">An Error Occurred</h2>
        <p className="text-lg mb-4">{orderStatus.error}</p>
        <div className="flex justify-center mt-4">
          <Button variant="neutral" onClick={cancelOrder}>
            Start New Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!orderStatus || !orderStatus.paid ? (
        // Payment not yet made
        <div className="flex flex-col justify-center items-center">
          <p className="my-4 text-xl">Pay with any Lightning wallet:</p>
          <div className="flex items-center w-full rounded border-border dark:border-darkBorder border-2 mb-4">
            <KeyInput
              type="text"
              value={order.payreq}
              readOnly
              className="w-full mr-2"
            />
            <Button
              variant={"noShadow"}
              className="h-full border-none flex justify-center items-center"
              onClick={handleCopyPayreq}
            >
              <IoCopyOutline
                color="black"
                title="Copy Invoice"
                className="h-full w-6"
              />
            </Button>
          </div>
          <div className="flex justify-center mb-4">
            <QRCodeSVG
              value={order.payreq}
              size={256}
              className="p-4 bg-white"
            />
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="neutral" onClick={cancelOrder}>
              Cancel Order
            </Button>
          </div>
        </div>
      ) : (
        // Payment made
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold my-4">Order in Progress</h2>

          <Alert
            variant={"destructive"}
            className="w-full mx-auto my-4 max-w-screen-md"
          >
            <FaInfoCircle className="h-5 w-5 " />
            <AlertDescription>
              Note that if you have not received an SMS code successfully after
              20 minutes, your payment will be canceled automatically and funds
              will return to your wallet. No refund needed!
            </AlertDescription>
          </Alert>
          <div className="flex flex-col my-4 text-xl">
            <p>Country: {orderStatus.country}</p>
            <p>Service: {orderStatus.service}</p>
            <div className="flex items-center gap-2">
              <div>Phone Number:</div>
              <div className="flex items-center  rounded border-border dark:border-darkBorder border-2 ">
                <KeyInput
                  type="text"
                  value={orderStatus.number}
                  readOnly
                  className="w-full text-xl text-center"
                />
                <Button
                  variant={"noShadow"}
                  className="h-full border-none flex justify-center items-center"
                  onClick={handleCopyNumber}
                >
                  <IoCopyOutline
                    color="black"
                    title="Copy Number"
                    className=" w-6"
                  />
                </Button>
              </div>
            </div>
            {orderStatus.code ? (
              <div className="flex items-center">
                <p className="mr-2">Activation Code: {orderStatus.code}</p>
                <Button variant="neutral" onClick={handleCopyCode}>
                  {copiedCode ? "Copied" : "Copy"}
                </Button>
              </div>
            ) : (
              <p className="flex gap-2 text-xl my-4">
                Waiting for activation code...{" "}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
