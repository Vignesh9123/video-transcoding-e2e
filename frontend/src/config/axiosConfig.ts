import { PRIMARY_BACKEND_URL } from "@/constants";
import axios from "axios";

export const axiosClient = axios.create({
    baseURL: PRIMARY_BACKEND_URL,
    withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
    config.headers["Content-Type"] = "application/json";
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
});