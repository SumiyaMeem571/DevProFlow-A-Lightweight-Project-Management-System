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
  const token = localStorage.getItem("access_token"); // Adjust based on your token storage
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

// Task-related functions
const getAllTasks = async () => {
  return await safeApiCall(() =>
    axios.get(endpoints.tasks.getAllTasks, { headers: getHeaders() })
  );
};

const getAllTaskOfProject = async (projectId) => {
  return await safeApiCall(() =>
    axios.get(endpoints.tasks.getAllTaskOfProject(projectId), {
      headers: getHeaders(),
    })
  );
};

const getTaskById = async (id) => {
  return await safeApiCall(() =>
    axios.get(endpoints.tasks.getTaskById(id), { headers: getHeaders() })
  );
};

const createTask = async (data) => {
  return await safeApiCall(() =>
    axios.post(endpoints.tasks.createTask, data, { headers: getHeaders() })
  );
};

const updateTask = async (id, data) => {
  return await safeApiCall(() =>
    axios.patch(endpoints.tasks.updateTask(id), data, { headers: getHeaders() })
  );
};

const deleteTask = async (id) => {
  return await safeApiCall(() =>
    axios.delete(endpoints.tasks.deleteTask(id), { headers: getHeaders() })
  );
};
const getUserForTask = async () => {
  return await safeApiCall(() =>
    axios.get(endpoints.tasks.getUserForTask, { headers: getHeaders() })
  );
};

export default {
  getAllTasks,
  getAllTaskOfProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getUserForTask,
};
