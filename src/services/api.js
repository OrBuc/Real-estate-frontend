import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Interceptor להוסיף JWT token לכל בקשה
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor לטיפול בשגיאות אימות
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // אם ה-token פג תוקף, נקה אותו
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      // אפשר להוסיף redirect ל-login
    }
    return Promise.reject(error);
  }
);

export default api;
