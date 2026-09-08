import apiClient from "../api/apiClient";

export async function login(email, password) {
    const response = await apiClient.post("/auth/login", {
        email,
        password
    });

    return response.data;
}

export async function register(userData) {
    const response = await apiClient.post(
        "/users/register",
        userData
    );

    return response.data;
}