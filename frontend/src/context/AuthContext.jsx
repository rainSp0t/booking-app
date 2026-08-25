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

        return payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ?? null;
    } catch {
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