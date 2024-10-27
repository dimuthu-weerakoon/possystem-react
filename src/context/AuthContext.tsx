import { createContext, useContext, useEffect, useState } from "react";
import AuthContextType from "../types/AuthContextType";
import AuthProviderpropsType from "./AuthProviderpropsType";

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    jwtToken: null,
    loading: true,
    signup: () => { },
    login: () => { },
    logout: () => { }
});

export const AuthProvider = ({ children }: AuthProviderpropsType) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Function to log in
    const login = (token: string) => {
        setIsAuthenticated(true);
        setJwtToken(token);
        localStorage.setItem("token", token);
    };
    const signup = (token: string) => {
        login(token);
    };
    // Function to log out
    const logout = () => {
        setIsAuthenticated(false);
        setJwtToken(null);
        localStorage.removeItem("token");
    };

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            setJwtToken(token);
        }
        setLoading(false)

    }, []);

    return (
        <AuthContext.Provider value={{ signup, isAuthenticated, jwtToken, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}
