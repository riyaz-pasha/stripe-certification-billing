import React, { useState } from "react";
import useAxios from "../hooks/useAxios";
import { SubscriptionStatuses, ClickEvent, OfferingPrice } from "../types";

interface OnDemandSubscriptionProps {
  user: {
    id: string;
  };
  subscription: {
    id: string;
    type: "monthly" | "ondemand";
    status: SubscriptionStatuses;
  };
  price: OfferingPrice;
}

function OnDemandSubscription({ user, price, subscription }: OnDemandSubscriptionProps) {
  const [sessionRegistered, setSessionRegistered] = useState(false);
  const axios = useAxios();

  const handlePortalClick = async (event: ClickEvent) => {
    event.preventDefault();
    const response = await axios.post("/users/portal", {
      priceType: "ondemand",
    });
    window.location.replace(response.data.url);
  };

  const handleUsageRecordClick = async (event: ClickEvent) => {
    event.preventDefault();
    await axios.post("/offerings/paircode/schedule");
    setSessionRegistered(true);
  };

  let sessionRegisteredNotification;

  if (sessionRegistered) {
    sessionRegisteredNotification = (
      <p id="session-registered">Session registered</p>
    );
  }

  return (
    <div
      className="col"
      data-subscription-id={subscription.id}
      data-ondemand-price-id={price.id}
      data-customer-id={user.id}
    >
      <div className="nes-container mb-5">
        <p id="subscription-type">
          You are subscribed to the on-demand package.
        </p>
        <p>On demand: {price.formatted} per lesson.</p>
        <p>
          <button
            className="nes-btn is-primary"
            onClick={handlePortalClick}
            id="manage-subscription"
          >
            Manage subscription
          </button>
        </p>
      </div>
      <div>
        <div className="nes-container with-title">
          <p className="title">Arrange session</p>
          <p>Click to register for a session with your /dev/chat instructor.</p>
          {sessionRegisteredNotification}
          <p>
            <button
              className="nes-btn is-success"
              id="arrange-session"
              onClick={handleUsageRecordClick}
            >
              Arrange session
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OnDemandSubscription;
