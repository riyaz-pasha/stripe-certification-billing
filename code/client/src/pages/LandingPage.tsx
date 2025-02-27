import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import PageFrame from "../components/PageFrame";
import Welcome from "../components/Welcome";
import { useOfferings } from '../hooks/useOfferings';

function LandingPage() {
  const [error, setError] = useState(null);
  const { pairCode, formatPrice } = useOfferings({ onError: (err) => setError(err) });

  if (!pairCode) return (
    <PageFrame>
      <Welcome />
      <div className="container">
        <div className="row">
          <div className="col">
            Loading offerings...
          </div>
        </div>
      </div>
    </PageFrame>
  )

  return (
    <PageFrame>
      {error}
      <div className="container">
        <Welcome />

        <div className="container">
          <div className="row">
            <div
              className="col"
              data-monthly-price-id={
                pairCode.monthlyPrice && pairCode.monthlyPrice.id
                  ? pairCode.monthlyPrice.id
                  : "data-monthly-price-id"
              }
            >
              <div className="card nes-container">
                <div className="card-body">
                  <h5 className="card-title">Monthly package</h5>
                  <p className="card-text">
                    Reach out for one 60-minute session each month.
                  </p>
                  <NavLink to="/login" className="navbar-brand">
                    <button
                      id="monthly-subscription"
                      className="nes-btn is-primary"
                      type="button"
                    >
                      {pairCode
                        ? formatPrice(pairCode.monthlyPrice)
                        : ""}{" "}
                      per month
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
            <div
              className="col"
              data-ondemand-price-id={
                pairCode.onDemandPrice
                  ? pairCode.onDemandPrice.id
                  : "data-ondemand-price-id"
              }
            >
              <div className="card nes-container">
                <div className="card-body">
                  <h5 className="card-title">On-demand package</h5>
                  <p className="card-text">
                    Request sessions whenever you need them.
                  </p>
                  <NavLink to="/login" className="navbar-brand">
                    <button
                      id="ondemand-subscription"
                      className="nes-btn is-primary"
                      type="button"
                    >
                      {pairCode.onDemandPrice
                        ? formatPrice(pairCode.onDemandPrice)
                        : ""}{" "}
                      per session
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  )
}

export default LandingPage;
