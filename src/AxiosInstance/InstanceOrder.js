import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_NOT_PRIVATE_URL,
});

export default AxiosInstance;
