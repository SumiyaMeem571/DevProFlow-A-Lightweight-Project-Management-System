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

// Helper to get headers
const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

// get all users
const getAllUsers = async () => {
  return await safeApiCall(() =>
    axios.get(endpoints.admin.getAllUsers, { headers: getHeaders() })
  );
};

const updateUser = async (id, data) => {
  return await safeApiCall(() =>
    axios.patch(endpoints.admin.updateUser(id), data, { headers: getHeaders() })
  );
};

const deleteUser = async (id) => {
  return await safeApiCall(() =>
    axios.delete(endpoints.admin.deleteUser(id), { headers: getHeaders() })
  );
};

const getUserById = async (id) => {
  return await safeApiCall(() =>
    axios.get(endpoints.admin.getUserById(id), { headers: getHeaders() })
  );
};

export default {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
};
