import { CONFIG } from "@/config-global";
import axios, { all } from "axios";

// Axios instance
const axiosInstance = axios.create({
  // baseURL: "http://localhost:4000",
  baseURL: CONFIG.serverUrl,
  // Axios configuration options here
});

export default axiosInstance;

export const endpoints = {
  auth: {
    login: "/auth/login/",
    register: "/auth/register/",
  },
  admin: {
    getAllUsers: "/admin/all-users/",
    updateUser: (id) => `/admin/update-user/${id}/`,
    deleteUser: (id) => `/admin/remove-user/${id}/`,
    getUserById: (id) => `/admin/get-user/${id}/`,
  },
  project: {
    getAllProjects: "/projects/",
    getProjectById: (id) => `/projects/${id}/`,
    createProject: "projects/create-project/",
    updateProject: (id) => `/projects/update-project/${id}/`,
    deleteProject: (id) => `/projects/remove-project/${id}/`,
  },
  tasks: {
    getAllTasks: "/tasks/",
    getUserForTask: "/user/getUserforTask/",
    getAllTaskOfProject: (id) => `/tasks/project/${id}/`,
    getTaskById: (id) => `/tasks/${id}/`,
    createTask: "/tasks/",
    updateTask: (id) => `/tasks/${id}/`,
    deleteTask: (id) => `/tasks/${id}/`,
  },
};
