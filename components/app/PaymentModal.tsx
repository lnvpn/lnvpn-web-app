import React, { useEffect, useState } from "react";
import Modal from "@/components/react/components/Modal";
import { QRCodeSVG } from "qrcode.react";
import { getInvoice, checkInvoice } from "@/utils/lightning";
import { FaSpinner } from "react-icons/fa6";
import { FcCheckmark } from "react-icons/fc";
import { KeyInput } from "../ui/VPN/KeyInput";
import { IoCopyOutline } from "react-icons/io5";
import { BsLightningChargeFill } from "react-icons/bs";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaymentModalProps {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  amount: number;
  memo: string;
  onPaymentSuccess?: () => void;
}

interface InvoiceResponse {
  payment_hash: string;
  payment_request: string;
  payment_amount_msat: number;
}

export default function PaymentModal({
  active,
  setActive,
  amount,
  memo,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const generateInvoice = async () => {
      try {
        const data = await getInvoice(amount, memo);
        if (isMounted) {
          setInvoice(data);
        }
      } catch (err) {
        console.error("Error generating invoice:", err);
        if (isMounted) {
          setError("Failed to generate invoice.");
        }
      }
    };

    if (active) {
      generateInvoice();
    }

    return () => {
      isMounted = false;
      setInvoice(null);
      setIsPaid(false);
      setError(null);
      setCopiedInvoice(false);
    };
  }, [active, amount, memo]);

  useEffect(() => {
    if (!invoice || !active || isPaid) return;

    const checkPaymentStatus = async () => {
      try {
        const invoiceData = await checkInvoice(invoice.payment_hash);
        if (invoiceData && invoiceData.settled) {
          clearInterval(intervalId);
          setIsPaid(true);
          onPaymentSuccess?.();
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
      }
    };

    const intervalId = setInterval(checkPaymentStatus, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, [invoice, active, onPaymentSuccess, isPaid]);

  // New useEffect for handling modal close after payment
  useEffect(() => {
    if (isPaid) {
      const timeoutId = setTimeout(() => {
        setActive(false);
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isPaid, setActive]);

  const handleCopyInvoice = () => {
    if (invoice) {
      navigator.clipboard.writeText(invoice.payment_request);
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2000);
    }
  };

  return (
    <Modal active={active} setActive={setActive}>
      <div className="p-4">
        {error && <p className="text-red-500">{error}</p>}

        {!error && !invoice && (
          <div className="flex flex-col items-center gap-2">
            <p>Generating invoice...</p>
            <FaSpinner className="animate-spin h-6 w-6" />
          </div>
        )}

        {!error && invoice && !isPaid && (
          <div className="flex flex-col items-center justify-center">
            <p>
              This QR-Code is a Bitcoin Lightning invoice. You can pay with any
              Lightning wallet or Cash-App.
            </p>

            <div className="my-4 flex justify-center">
              <QRCodeSVG
                value={invoice.payment_request}
                size={256}
                className="bg-white p-4"
              />
            </div>
            <p className="text-xl font-bold mb-4">
              {invoice.payment_amount_msat} Sats
            </p>
            <div className="flex items-stretch w-full rounded border-border dark:border-darkBorder border-2">
              <span className="px-3 py-2 whitespace-nowrap bg-main text-sm">
                <BsLightningChargeFill className="h-6 w-6" />
              </span>
              <KeyInput value={invoice.payment_request} />
              <TooltipProvider>
                <Tooltip open={copiedInvoice}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"noShadow"}
                      className="h-full border-none flex justify-center items-center"
                      onClick={handleCopyInvoice}
                    >
                      <IoCopyOutline
                        color="black"
                        title="Copy Invoice"
                        className="h-full w-6"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Copied</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        {!error && isPaid && (
          <div className="flex flex-col items-center gap-4">
            <FcCheckmark className="h-16 w-16" />
            <p className="text-xl">Payment received! Thank you.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
