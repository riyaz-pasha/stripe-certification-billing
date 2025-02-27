import React from "react";
import useAxios from "../hooks/useAxios";
import { OfferingPrice, SubscriptionStatuses } from '../types';

interface MonthlySubscriptionProps {
  user: {
    id: string
  },
  subscription: {
    id: string,
    status: SubscriptionStatuses
  },
  price: OfferingPrice
}

function MonthlySubscription({ user, price, subscription }: MonthlySubscriptionProps) {
  const axios = useAxios();
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    const response = await axios.post("/users/portal", {
      priceType: "monthly",
    });
    window.location.replace(response.data.url);
  };

  return (
    <div
      className="col"
      data-subscription-id={subscription.id}
      data-monthly-price-id={price.id}
      data-customer-id={user.id}
    >
      <div className="card nes-container">
        <div className="card-body">
          <h5 className="card-title" id="subscription-type">
            You are subscribed to the monthly package
          </h5>
          <p>
            {price.formatted} per month. Your subscription is{" "}
            <span id="subscription-status">{subscription.status}</span>.
          </p>
          <button
            className="nes-btn is-primary"
            onClick={handleClick}
            id="manage-subscription"
          >
            Manage subscription
          </button>
        </div>
      </div>
    </div>
  );
}

export default MonthlySubscription;
