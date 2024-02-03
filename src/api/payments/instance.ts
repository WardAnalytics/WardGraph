import Axios, { AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.VITE_PAYMENTS_SERVICE_URL,
  timeout: 5000, // 5 second timeout
});

export const instance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data,
  );
  return promise;
};
