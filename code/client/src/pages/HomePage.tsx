import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageFrame from "../components/PageFrame";
import Subscriptions from "../components/Subscriptions";
import { useOfferings } from '../hooks/useOfferings';
import { useAuth } from '../hooks/useAuth';
import Welcome from "../components/Welcome";

function HomePage() {
  const [error, setError] = useState(null as null | string);
  const navigate = useNavigate();
  const { user, fetchUser } = useAuth();
  const { pairCode, workshop } = useOfferings();

  useEffect(() => {
    async function loadUser() {
      try {
        const queryParameters = new URLSearchParams(window.location.search);
        const sessionId = queryParameters.get("session_id");
        await fetchUser(sessionId || undefined);
      } catch (error: any) {
        setError(error.message);
        navigate("/login", { replace: true });
      }
    };
    loadUser();
  }, []);

  let errorMessage = null;
  let subscription = <>"Loading..."</>;
  let welcomeMessage;

  if (error) {
    errorMessage = <p>Error: {error}</p>;
  }

  if (pairCode && user) {
    subscription = (
      <Subscriptions
        {...{ pairCode, workshop, user }}
      />
    );

    if (user.subscription && user.subscription.status === "canceled") {
      welcomeMessage = (
        <div className="nes-container with-title is-centered mt-5 mb-5">
          <p className="title" id="subscription-ended">
            you have ended your /dev/chat subscription
          </p>
          <p className="is-error">Hope to see you again soon!</p>
        </div>
      );
    } else {
      welcomeMessage = (
        <Welcome />
      );
    }
  }

  return (
    <PageFrame>
      {welcomeMessage}
      {errorMessage}
      {subscription}
    </PageFrame>
  )
}

export default HomePage;
