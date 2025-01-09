/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import ServiceSelector from "./ServiceSelector";
import { SMSCountrySelector } from "./SMSCountrySelector";
import OrderStatus from "./OrderStatus";
import { Button } from "../../ui/button";
import { FaSpinner } from "react-icons/fa6";

interface Country {
  cc: number;
  country: string;
}

interface Service {
  key: string;
  text: string;
  value: string;
  count: string;
  image: {
    avatar: boolean;
    src: string;
  };
}

interface Order {
  orderId: string;
  payreq: string;
}

interface OrderStatusType {
  status: string;
  paid: boolean;
  code?: number;
  id?: number;
  number?: number;
  timestamp?: number;
  error?: string;
  country?: string;
  service?: string;
}

export default function SMSCheckout() {
  const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(
    null
  );
  const [selectedService, setSelectedService] = React.useState<Service | null>(
    null
  );
  const [order, setOrder] = React.useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = React.useState<OrderStatusType | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const createReceiveOrder = async () => {
    if (!selectedCountry || !selectedService) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api2.sms4sats.com/createorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: selectedCountry.country,
          service: selectedService.key,
          isRental: false,
          realphone: false,
          ref: "lnvpn@getalby.com",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error creating order: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Order created:", data);
      setOrder(data); // Set orderId and payreq
    } catch (error: any) {
      console.error("Error creating order:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = () => {
    setOrder(null);
    setOrderStatus(null);
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (order) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(
            `https://api2.sms4sats.com/orderstatus?orderId=${order.orderId}`
          );
          if (!response.ok) {
            throw new Error(
              `Error fetching order status: ${response.statusText}`
            );
          }
          const data = await response.json();
          console.log("Order status:", data);
          setOrderStatus(data);

          // Stop polling if the activation code is received or an error occurs
          if (data.code || data.error) {
            clearInterval(interval);
          }
        } catch (error: any) {
          console.error("Error fetching order status:", error);
          setError(error.message);
          clearInterval(interval);
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [order]);

  return (
    <div className="w-full mx-auto max-w-screen-md px-4 bg-main text-black rounded-base shadow-light font-bold border-2 border-border p-4">
      <div className="flex flex-col gap-3">
        {order ? (
          // Render the order details and status
          <OrderStatus
            order={order}
            orderStatus={orderStatus}
            cancelOrder={cancelOrder}
            error={error}
          />
        ) : (
          // Render the form to select country and service
          <>
            <p>
              This service gives you 20 minutes access to a disposable phone
              number to receive activation codes.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <SMSCountrySelector
                selectedCountry={selectedCountry}
                setSelectedCountry={(country) => {
                  setSelectedCountry(country);
                  setSelectedService(null);
                }}
              />
              <ServiceSelector
                selectedCountry={selectedCountry}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
              />
              <div className="w-full justify-center flex p-2">
                <Button
                  variant={"neutral"}
                  size={"lg"}
                  onClick={createReceiveOrder}
                  disabled={!selectedCountry || !selectedService || loading}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin h-6 w-6" />
                  ) : (
                    "Receive Activation Code"
                  )}
                </Button>
              </div>
              {error && <div className="text-lg">{error}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
