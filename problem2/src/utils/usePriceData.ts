import { useState, useEffect } from "react";

interface PriceData {
  currency: string;
  date: string;
  price: number;
}

export function usePriceData() {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPriceData() {
      try {
        const response = await fetch(
          "https://interview.switcheo.com/prices.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch price data");
        }
        const data: PriceData[] = await response.json();
        // Remove duplicates and keep the latest price for each currency
        const uniqueData = data.reduce((acc, current) => {
          const existing = acc.find(
            (item) => item.currency === current.currency
          );
          if (!existing || new Date(current.date) > new Date(existing.date)) {
            return [
              ...acc.filter((item) => item.currency !== current.currency),
              current,
            ];
          }
          return acc;
        }, [] as PriceData[]);
        setPriceData(uniqueData);
      } catch (err) {
        setError("Failed to fetch price data" + err);
      } finally {
        setLoading(false);
      }
    }

    fetchPriceData();
  }, []);

  return { priceData, loading, error };
}