import React from "react";
import MonthlySubscription from "./MonthlySubscription";
import NoSubscription from "./NoSubscription";
import OnDemandSubscription from "./OnDemandSubscription";
import Workshop from "./Workshop";
import { User, Offerings } from "../types";

interface SubscriptionsProps extends Offerings {
  user: User;
}

const Subscriptions = ({ pairCode, workshop, user }: SubscriptionsProps) => {

  let currentSubscription = null;
  let currentWorkshop = null;

  if (
    user.subscription &&
    user.subscription.status &&
    user.subscription.status !== "canceled"
  ) {
    switch (user.subscription.type) {
      case "monthly":
        if (!pairCode) throw new Error("User shouldn't have active sub if monthly pairCode offering doesn't exist");
        currentSubscription = (
          <MonthlySubscription
            user={user}
            price={pairCode.monthlyPrice}
            subscription={user.subscription}
          />
        );
        break;
      case "ondemand":
        if (!pairCode?.onDemandPrice) throw new Error("User shouldn't have active sub if onDemand pairCode offering doesn't exist");
        currentSubscription = (
          <OnDemandSubscription
            user={user}
            price={pairCode.onDemandPrice}
            subscription={user.subscription}
          />
        );
        break;
      default:
        throw new Error("Subscription type does not match monthly or ondemand");
    }
    if (workshop && workshop.perSeatPrice) {
      currentWorkshop = <Workshop perSeatPrice={workshop.perSeatPrice} />;
    }
  } else if (!pairCode) {
    currentSubscription = (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card nes-container">
              <div className="card-body">
                <h5 className="card-title">Please wait</h5>
                <p className="card-text">
                  Retrieving offerings now...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    currentSubscription = <NoSubscription {...{ pairCode }} />;
  }

  return (
    <div className="container">
      <div className="row">
        {currentSubscription}
        {currentWorkshop}
      </div>
    </div>
  );
}

export default Subscriptions;
