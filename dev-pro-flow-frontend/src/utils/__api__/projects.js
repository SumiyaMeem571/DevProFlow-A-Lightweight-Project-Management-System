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

// Project-related functions
const getAllProjects = async () => {
  return await safeApiCall(() =>
    axios.get(endpoints.project.getAllProjects, { headers: getHeaders() })
  );
};

const getProjectById = async (id) => {
  return await safeApiCall(() =>
    axios.get(endpoints.project.getProjectById(id), { headers: getHeaders() })
  );
};

const createProject = async (data) => {
  return await safeApiCall(() =>
    axios.post(endpoints.project.createProject, data, { headers: getHeaders() })
  );
};

const updateProject = async (id, data) => {
  return await safeApiCall(() =>
    axios.patch(endpoints.project.updateProject(id), data, {
      headers: getHeaders(),
    })
  );
};

const deleteProject = async (id) => {
  return await safeApiCall(() =>
    axios.delete(endpoints.project.deleteProject(id), { headers: getHeaders() })
  );
};

export default {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
