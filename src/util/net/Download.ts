import axios, { AxiosInstance } from "axios";
import { DEFAULT_BASE_URL } from "./Net";
import { clearAuth } from "../auth/Auth";
import { navigate } from "../../action/Router";

interface DownloadFileParams {
  url: string;
  baseUrl?: string;
}

const downloadFile = async (params: DownloadFileParams) => {
  const { url, baseUrl = DEFAULT_BASE_URL } = params;

  const instance: AxiosInstance = axios.create();

  instance.interceptors.request.use(config => {
    const token: string | null = localStorage.getItem('token');
    if (token === null) {
      clearAuth();
      navigate('/login');
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const response = await instance.get(url, {
    responseType: 'blob',
    baseURL: baseUrl
  });

  const blob = response.data;
  const urlObject = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = urlObject;

  const contentDisposition = response.headers['content-disposition'];
  const fileName = contentDisposition.match(/filename=(.+)/)[1];

  link.download = fileName;
  link.click();

  window.URL.revokeObjectURL(url);
};

export { downloadFile };