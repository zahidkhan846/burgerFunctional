import { useState, useEffect } from "react";

export default (httpClient) => {
  const [error, setError] = useState(null);

  const reqInteceptors = httpClient.interceptors.request.use((request) => {
    setError(null);
    return request;
  });

  const resInteceptors = httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      setError(error);
    }
  );

  useEffect(() => {
    httpClient.interceptors.request.eject(reqInteceptors);
    httpClient.interceptors.response.eject(resInteceptors);
  }, [reqInteceptors, resInteceptors, httpClient]);

  const closeErrorHandler = () => {
    setError(null);
  };

  return [error, closeErrorHandler];
};
