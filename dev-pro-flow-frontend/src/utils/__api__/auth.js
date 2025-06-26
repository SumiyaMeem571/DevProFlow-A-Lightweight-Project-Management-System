import { cache } from "react";
import axios, { endpoints } from "@/utils/axiosInstance";

export const safeApiCall = async (fn) => {
  try {
    const response = await fn();
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: "Network error - backend may be down" };
    } else {
      throw { message: error.message };
    }
  }
};

// Register and login functions
const register = cache(async (data) => {
  return await safeApiCall(() => axios.post(endpoints.auth.register, data));
});

const login = cache(async (data) => {
  return await safeApiCall(() => axios.post(endpoints.auth.login, data));
});

export default {
  register,
  login,
};
