import axios from "axios";


const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use((config) => {

    const data = JSON.parse(localStorage.getItem("persist:root"));
    const tokenPuro = data.token.replace(/['"]+/g, '');

    config.headers.Authorization = tokenPuro;

    return config;
});

export default instance;