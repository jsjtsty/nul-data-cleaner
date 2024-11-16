import axios, { AxiosResponse } from 'axios';

interface NulResponse<T> {
  version: number;
  code: number;
  message: string;
  data: T;
}

interface GetParams {
  url: string;
  baseUrl?: string | null;
  params?: object;
}

const get = async <Response> (getParams: GetParams): Promise<AxiosResponse<NulResponse<Response>>> => {
  const {
    url,
    baseUrl = 'https://widiagnosis.com/',
    params
  } = getParams;
  const instance = axios.create({
    baseURL: baseUrl ?? undefined
  });
  return instance.get<NulResponse<Response>>(url, { params: params });
};

export const net = { get };