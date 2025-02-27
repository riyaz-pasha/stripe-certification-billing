import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

import { AuthProvider } from './hooks/useAuth';
import AuthenticatedRoute from "./components/AuthenticatedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";

export const history = createBrowserHistory();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthenticatedRoute />}>
            <Route path="/dashboard" element={<HomePage />} />
          </Route>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
