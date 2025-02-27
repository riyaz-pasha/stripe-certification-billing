import React, { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageFrame from "../components/PageFrame";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import type { InputHandler, SubmitHandler } from "../types";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("" as string | ReactElement);
  const Auth = useAuth();
  const axios = useAxios();

  const isLoggedIn = Auth.isLoggedIn();
  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard", { replace: true });
  }, [isLoggedIn]);

  const handleChange: InputHandler = (event) => setEmail(event.target.value);

  const handleSubmit: SubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`/users`, { email });
      Auth.login(response.data);
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      const errorMessage = (
        <div className="alert alert-danger mb-3" role="alert">
          {error.response.data.error.message}
        </div>
      );
      setError(errorMessage);
    }
  };

  return (
    <PageFrame>
      <div className="row justify-content-center">
        <div className="col-4">
          <form className="mb-3" onSubmit={handleSubmit}>
            <p>{error}</p>
            <div className="mb-3">
              <label htmlFor="email" id="email">
                Email address:
              </label>
              <input
                className="form-control nes-input"
                required
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                aria-describedby="emailHelp"
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <button type="submit" className="nes-btn is-primary">
                Login or register
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageFrame>
  );
}

export default LoginPage;
