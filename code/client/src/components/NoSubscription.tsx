import React from "react";
import useAxios from "../hooks/useAxios";
import { ClickEvent, PairCodeOffering } from "../types";

interface NoSubscriptionProps {
  pairCode: PairCodeOffering
}

function NoSubscription({ pairCode }: NoSubscriptionProps) {
  const axios = useAxios();
  const handleSubscribeClick = async (priceId: string, event: ClickEvent) => {
    event.preventDefault();
    const response = await axios.post("/offerings/paircode", { price: priceId });
    window.location.replace(response.data.url);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="card nes-container">
            <div className="card-body">
              <h5 className="card-title">Basic</h5>
              <p className="card-text">
                Reach out for one 60-minute session each month.
              </p>
              <button
                id="monthly-subscription"
                className="nes-btn is-primary"
                type="button"
                onClick={(event) => {
                  handleSubscribeClick(pairCode.monthlyPrice.id, event);
                }}
              >
                {pairCode.monthlyPrice.formatted} per month
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card nes-container">
            <div className="card-body">
              <h5 className="card-title">On-demand</h5>
              <p className="card-text">
                Request sessions whenever you need them.
              </p>
              <button
                id="ondemand-subscription"
                className="nes-btn is-primary"
                type="button"
                onClick={(event) => {
                  if (pairCode.onDemandPrice) {
                    handleSubscribeClick(pairCode.onDemandPrice.id, event);
                  }
                }}
              >
                {pairCode.onDemandPrice?.formatted} per session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoSubscription;
