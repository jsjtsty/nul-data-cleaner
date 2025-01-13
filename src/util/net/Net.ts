import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { navigate } from '../../action/Router';
import { NulException, NulExceptionConstants } from '../exception/NulException';
import { postGlobalAlert } from '../../action/GlobalAlert';
import { clearAuth } from '../auth/Auth';

// const DEFAULT_BASE_URL = 'https://widiagnosis.com/';
const DEFAULT_BASE_URL = 'http://106.75.215.104/api/';
// const DEFAULT_BASE_URL = 'http://localhost:8080/';

interface NulResponse<T> {
  version: number;
  code: number;
  message: string;
  result: T;
}

interface GetParams {
  url: string;
  baseUrl?: string | null;
  params?: object;
  token?: boolean;
}

interface PutParams<Request> {
  url: string;
  baseUrl?: string | null;
  params?: object;
  body: Request;
}

interface PostParams<Request> {
  url: string;
  baseUrl?: string | null;
  params?: object;
  body?: Request;
  token?: boolean;
}

type ErrorHandler = (code: number, message: string) => void;
type ErrorHandlerMap = { [key: number]: ErrorHandler };

const fallbackHandler: ErrorHandler = (code, message) => {
  postGlobalAlert('Error', `${message} (Code ${code})`, 'warning');
};

function createAxiosInstance<Response>(withToken: boolean, baseUrl: string | null, errorHandlers?: ErrorHandlerMap, defaultHandler?: ErrorHandler) {
  const instance: AxiosInstance = axios.create({
    baseURL: baseUrl ?? DEFAULT_BASE_URL
  });

  if (withToken) {
    instance.interceptors.request.use(config => {
      const token: string | null = localStorage.getItem('token');
      if (token === null) {
        clearAuth();
        navigate('/login');
      }
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  instance.interceptors.response.use((response: AxiosResponse<NulResponse<Response>>) => {
    return response;
  }, (error: AxiosError<NulResponse<Response>>) => {
    if (error.response) {
      const data: NulResponse<Response> = error.response.data;
      if (data.code === NulExceptionConstants.INVALID_TOKEN) {
        clearAuth();
        navigate('/login', { invalidToken: true });
      }
      if (errorHandlers !== undefined && data.code in errorHandlers) {
        errorHandlers[data.code](data.code, data.message);
      } else if (defaultHandler !== undefined) {
        defaultHandler(data.code, data.message);
      } else {
        fallbackHandler(data.code, data.message);
      }
      return Promise.reject(new NulException(data.code, data.message));
    } else {
      return Promise.reject(new NulException(NulExceptionConstants.NETWORK_ERROR, error.message));
    }
  });

  return instance;
}

const get = async <Response>(getParams: GetParams): Promise<AxiosResponse<NulResponse<Response>>> => {
  const {
    url,
    baseUrl = DEFAULT_BASE_URL,
    params,
    token = true
  } = getParams;
  const instance = createAxiosInstance(token, baseUrl);
  return instance.get<NulResponse<Response>>(url, { params: params });
};

const post = async <Response = null, Request = null>(postParams: PostParams<Request>): Promise<AxiosResponse<NulResponse<Response>>> => {
  const {
    url,
    baseUrl = DEFAULT_BASE_URL,
    params,
    body,
    token = true
  } = postParams;
  const instance = createAxiosInstance(token, baseUrl);
  return instance.post<NulResponse<Response>, AxiosResponse<NulResponse<Response>>, Request>(url, body, { params: params });
};

const put = async <Response = null, Request = null>(putParams: PutParams<Request>): Promise<AxiosResponse<NulResponse<Response>>> => {
  const {
    url,
    baseUrl = DEFAULT_BASE_URL,
    params,
    body
  } = putParams;
  const instance = createAxiosInstance(true, baseUrl);
  return instance.put<NulResponse<Response>, AxiosResponse<NulResponse<Response>>, Request>(url, body, { params: params });
};

export const net = { get, post, put };
export { DEFAULT_BASE_URL };