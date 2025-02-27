import { useState, useEffect } from 'react';
import { OfferingPrice, Offerings } from "../types";

interface UseOfferingsProps {
  onError?: (err: any) => void;
}

export function useOfferings(props?: UseOfferingsProps) {
  const { onError } = props || {};
  const [offerings, setOfferings] = useState<Offerings | null>(null);
  const pairCode = offerings?.pairCode || null;
  const workshop = offerings?.workshop || null;

  async function fetchOfferings(): Promise<Offerings> {
    try {
      const response = await fetch("/offerings");
      const offerings: Offerings = await response.json();
      if (offerings.pairCode) {
        if (offerings.pairCode.monthlyPrice) {
          offerings.pairCode.monthlyPrice.formatted = formatPrice(offerings.pairCode.monthlyPrice);
        }
        if (offerings.pairCode.onDemandPrice) {
          offerings.pairCode.onDemandPrice.formatted = formatPrice(offerings.pairCode.onDemandPrice);
        }
      }
      if (offerings.workshop && offerings.workshop.perSeatPrice) {
        offerings.workshop.perSeatPrice.formatted = formatPrice(offerings.workshop.perSeatPrice);
      }
      setOfferings(offerings);
      return offerings;
    } catch (error) {
      throw new Error("Unable to fetch offerings");
    }
  }

  function reload() {
    fetchOfferings()
      .then((offerings) => setOfferings(offerings))
      .catch((err) => { if (onError) onError(err) });
  }

  useEffect(() => {
    reload();
  }, []);

  function formatPrice(price: OfferingPrice) {
    if (!price) return '??? USD';
    const { unit_amount, currency } = price;
    return `${unit_amount / 100} ${currency.toUpperCase()}`;
  }

  return { pairCode, workshop, reload, formatPrice };
}
