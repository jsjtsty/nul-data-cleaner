import axios, { AxiosResponse } from 'axios';

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
}

interface PutParams<Request> {
  url: string;
  baseUrl?: string | null;
  params?: object;
  body: Request;
}

const get = async <Response>(getParams: GetParams): Promise<AxiosResponse<NulResponse<Response>>> => {
  const {
    url,
    baseUrl = DEFAULT_BASE_URL,
    params
  } = getParams;
  const instance = axios.create({
    baseURL: baseUrl ?? undefined
  });
  return instance.get<NulResponse<Response>>(url, { params: params });
};

const put = async <Response = null, Request = null>(putParams: PutParams<Request>): Promise<AxiosResponse<NulResponse<Response>>> => {
  const {
    url,
    baseUrl = DEFAULT_BASE_URL,
    params,
    body
  } = putParams;
  const instance = axios.create({
    baseURL: baseUrl ?? undefined
  });
  return instance.put<NulResponse<Response>, AxiosResponse<NulResponse<Response>>, Request>(url, body, { params: params });
};

export const net = { get, put };
export { DEFAULT_BASE_URL };