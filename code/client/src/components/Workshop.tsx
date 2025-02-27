import React, { useState } from "react";
import useAxios from "../hooks/useAxios";
import { InputHandler, OfferingPrice } from "../types";

interface WorkshopProps {
  perSeatPrice: OfferingPrice;
}

const Workshop = ({ perSeatPrice }: WorkshopProps) => {
  const axios = useAxios();
  const [attendees, setAttendees] = useState(4);
  const [error, setError] = useState(null);
  const [workshopRegistered, setWorkshopRegistered] = useState(false);

  const handleChange: InputHandler = (event) => {
    const numAttendees = parseInt(event.target.value);
    setAttendees(numAttendees);
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      await axios.post("/offerings/workshop", { attendees });
      setWorkshopRegistered(true);
    } catch (error: any) {
      setError(error.response.data.error || error.message);
    }
  };

  let workShopRegisteredNotification;

  if (workshopRegistered) {
    workShopRegisteredNotification = (
      <p className="is-warning" id="workshop-notification">
        Workshop registered.
      </p>
    );
  }

  return (
    <div
      className="col"
      data-workshop-price-id={perSeatPrice ? perSeatPrice.id : "data-workshop-price-id"}
    >
      <div className="card nes-container">
        <p className="title">Register for workshop</p>
        {workShopRegisteredNotification}
        <form onSubmit={handleSubmit}>
          {error}
          <p>Priced at {perSeatPrice.formatted} per attendee.</p>
          <div className="row">
            <div className="col">
              <input
                type="number"
                max={100}
                min={0}
                className="nes-input is-warning"
                value={attendees}
                name="attendees"
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <button
                type="submit"
                className="nes-btn is-warning"
                id="register-workshop"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Workshop;
