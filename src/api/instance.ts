import Axios, { AxiosRequestConfig } from "axios";
//import { Cookies } from 'react-cookie'

//const cookies = new Cookies();

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.VITE_WARD_API_BASE_URL,
  timeout: 5000, // 5 second timeout
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  // TODO : rewrite this to store the api key in a cookie

  const api_key = process.env.VITE_WARD_API_KEY;

  if (api_key && config?.headers) {
    config.headers.api = `${api_key}`;
  }

  return config;
});

export const instance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data,
  );
  return promise;
};
