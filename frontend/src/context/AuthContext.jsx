import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function getRoleFromToken(token) {
    if (!token) {
        return null;
    }

    try {
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        const role =
            payload[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

        console.log("Extracted role:", role);

        return role ?? null;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
}


export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );
    
    const role = getRoleFromToken(token);

    function loginUser(newToken) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
    }

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                isAuthenticated,
                loginUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}