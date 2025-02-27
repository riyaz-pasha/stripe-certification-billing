import axios from "axios";
import { useAuth } from "./useAuth";

axios.defaults.params = {};
export const axiosInstance = axios.create({
  baseURL: `http://127.0.0.1:4242`,
  headers: { "Content-Type": "application/json" },
});

/**
 * Axios helper which automatically adds the authenticated
 * user_id onto every request as a query parameter.
 * 
 * @returns Axios client
 */
export function useAxios() {
  const Auth = useAuth();
  axiosInstance.interceptors.request.use(function (config) {
    if (Auth.isLoggedIn()) {
      config.params["user_id"] = Auth.getToken();
    }
    return config;
  });
  return axiosInstance;
}



export default useAxios;
