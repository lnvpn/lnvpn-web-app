import React, { useEffect, useState } from "react";

interface PriceProps {
  value: number;
  usd?: boolean;
}

const Price: React.FC<PriceProps> = (props) => {
  const [priceUSDinSats, setPrice] = useState<number>(0);

  useEffect(() => {
    const getPrice = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_PRICE_API as string
        );
        const data = await response.json();
        setPrice(100_000_000 / data.USD.buy);
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };

    getPrice();
  }, []);

  return (
    <div className="text-lg">
      {props.usd ? (
        <h3 className="price">
          Total: {props.value}$ ({Math.round(priceUSDinSats * props.value)}{" "}
          Sats)
        </h3>
      ) : (
        <h3 className="price">
          Total: {(props.value / priceUSDinSats).toFixed(2)}$ ({props.value}{" "}
          Sats)
        </h3>
      )}
    </div>
  );
};

export default Price;
