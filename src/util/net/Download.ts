import axios from "axios";
import { DEFAULT_BASE_URL } from "./Net";

interface DownloadFileParams {
  url: string;
  baseUrl?: string;
}

const downloadFile = async (params: DownloadFileParams) => {
  const { url, baseUrl = DEFAULT_BASE_URL } = params;

  const response = await axios.get(url, {
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