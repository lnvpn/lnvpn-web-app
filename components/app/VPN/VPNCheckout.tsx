"use client";
import * as React from "react";
import { useState } from "react";
import { generateKeypair } from "@/utils/wireguard";
import PaymentModal from "@/components/app/PaymentModal";
import VPNCheckoutForm from "./VPNCheckoutForm";
import VPNConfirmation from "./VPNConfirmation";

export default function VPNCheckout() {
  const [selectedDuration, setSelectedDuration] = useState<number>(0.1);
  const [isModalActive, setIsModalActive] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    ""
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [keys, setKeys] = useState<{
    publicKey: string;
    privateKey: string;
    presharedKey: string;
  }>(generateKeypair());

  const regenerateKeys = React.useCallback(() => {
    const newKeys = generateKeypair();
    setKeys(newKeys);
  }, []);

  const handlePurchase = () => {
    if (!selectedCountry) {
      setIsAlertOpen(true);
      return;
    }
    setIsModalActive(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentSuccessful(true);
    setCurrentStep(2);
  };

  React.useEffect(() => {
    regenerateKeys();
  }, [regenerateKeys]);

  return (
    <div className="w-full mx-auto  max-w-screen-md px-4 md:px-20 sm:px-6 lg:px-8 bg-main text-black rounded-base shadow-light dark:shadow-dark font-bold border-2 border-border dark:border-darkBorder p-4 ">
      {currentStep === 1 && (
        <VPNCheckoutForm
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          keys={keys}
          regenerateKeys={regenerateKeys}
          handlePurchase={handlePurchase}
          isAlertOpen={isAlertOpen}
          setIsAlertOpen={setIsAlertOpen}
        />
      )}

      {currentStep === 2 && isPaymentSuccessful && (
        <VPNConfirmation
          keys={keys}
          selectedCountry={selectedCountry}
          selectedDuration={selectedDuration}
          setCurrentStep={setCurrentStep}
          setIsPaymentSuccessful={setIsPaymentSuccessful}
          regenerateKeys={regenerateKeys}
          setSelectedCountry={setSelectedCountry}
        />
      )}

      <PaymentModal
        active={isModalActive}
        setActive={setIsModalActive}
        amount={selectedDuration}
        memo="LNVPN"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
