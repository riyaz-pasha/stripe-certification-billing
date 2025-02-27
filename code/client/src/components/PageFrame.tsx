import React, { useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface PageFrameProps {
    children: React.ReactNode;
}

/**
 * Sets up a nav bar and Bootstrap container element for the page's content.
 * 
 * @returns 
 */
export default function PageFrame({ children }: PageFrameProps) {

    const Auth = useAuth();
    const navigate = useNavigate();
    const handleLogoutClick = useCallback(() => {
        Auth.logout();
        navigate("/login", { replace: true });
    }, [navigate]);

    let navButtons;

    if (Auth.isLoggedIn()) {
        navButtons = (
            <div className="d-flex">
                <NavLink to="/dashboard">
                    <button className="nes-btn is-primary" type="button">
                        Dashboard
                    </button>
                </NavLink>
                <NavLink to="/">
                    <button
                        className="nes-btn is-error ms-2"
                        type="button"
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </button>
                </NavLink>
            </div>
        );
    } else {
        navButtons = (
            <NavLink to="/login" className="navbar-brand">
                <button className="nes-btn" type="button" id="login">
                    Login
                </button>
            </NavLink>
        );
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
                <div className="container-fluid">
                    <NavLink to="/" className="navbar-brand">
                        <span className="nes-text is-primary">/dev/chat</span>
                    </NavLink>
                    {navButtons}
                </div>
            </nav>
            <div className="container">
                {children}
            </div>
        </>
    );
}
