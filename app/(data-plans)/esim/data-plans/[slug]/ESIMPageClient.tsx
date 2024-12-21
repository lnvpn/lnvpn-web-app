"use client";

import React, { useState } from "react";
import ESIMRadioGroup, {
  Plan,
} from "@/components/app/eSIM/[slug]/ESIMRadioGroup";

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import PaymentModal from "@/components/app/PaymentModal";
import { ProcessedBundle } from "@/components/app/eSIM/[slug]/SIMDetailPageActions";

interface ESIMPageClientProps {
  plans: ProcessedBundle[];
  isoCode: string | null;
  slug: string;
}

const ESIMPageClient: React.FC<ESIMPageClientProps> = ({
  plans,
  isoCode,
  slug,
}) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const router = useRouter();

  const handleSelect = (plan: Plan) => {
    const newOrderId = uuidv4();
    setSelectedPlan(plan);
    setOrderId(newOrderId);
    setIsModalActive(true);
  };

  const handlePaymentSuccess = () => {
    // Redirect to the order confirmation page
    router.push(`/order/${orderId}`);
  };

  return (
    <>
      <ESIMRadioGroup plans={plans} onSelect={handleSelect} />
      {selectedPlan && (
        <PaymentModal
          active={isModalActive}
          setActive={setIsModalActive}
          amount={selectedPlan.price}
          memo={`lnvpn.net/order/${orderId}`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default ESIMPageClient;
