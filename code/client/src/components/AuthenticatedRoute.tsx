import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AuthenticatedRoute() {
  const Auth = useAuth();
  return Auth.isLoggedIn() ? <Outlet /> : <Navigate to="/login" />;
}

export default AuthenticatedRoute;
