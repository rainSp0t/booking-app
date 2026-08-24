import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://localhost:7011/api"
});

export default apiClient;