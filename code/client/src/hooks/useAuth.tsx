/* eslint-disable @typescript-eslint/no-empty-function */

import React, { useEffect, createContext } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { axiosInstance } from "./useAxios";
import { User } from '../types';

interface AuthContext {
    getToken: () => string | undefined;
    isLoggedIn: () => boolean;
    login: (user: User) => void;
    logout: () => void;
    user: User | null;
    fetchUser: (sessionId?: string) => Promise<User>;
}

const AuthContext = createContext({
    getToken: () => { },
    isLoggedIn: () => { },
    login: (user: User) => { },
    logout: () => { },
    user: null,
    fetchUser: (sessionId?: string) => { },
} as AuthContext);




export function AuthProvider(props: React.PropsWithChildren<object>) {
    const { children } = props;
    const [user, setUser] = useLocalStorage<User | null>("user", null);

    async function fetchUser(session_id?: string): Promise<User> {
        try {
            const user_id = getToken();
            if (!user_id) throw new Error("No user id found");
            const params: Record<string, string> = { user_id };
            if (session_id) params.session_id = session_id;
            const response = await axiosInstance.get("/users", { params });
            if (response.status === 404) {
                logout();
                throw new Error("User not found");
            }
            login(response.data.user as User);
            return user as User;
        } catch (error) {
            throw new Error("User not found");
        }
    }

    useEffect(function wrapper() {
        async function loadOnStart() {
            const token = getToken();
            if (token && !user) {
                await fetchUser();
            }
        }
        loadOnStart();
    }, [])

    function getToken() {
        return user?.id;
    }

    function isLoggedIn() {
        return user !== null;
    }

    function login(user: User) {
        return setUser(user);
    }

    function logout() {
        return setUser(null);
    }

    const AuthValue: AuthContext = {
        getToken,
        isLoggedIn,
        login,
        logout,
        user,
        fetchUser
    };

    return (
        <AuthContext.Provider value={AuthValue} >
            {children}
        </ AuthContext.Provider>
    );
}

export function useAuth() {
    return React.useContext(AuthContext);
}

export default useAuth;