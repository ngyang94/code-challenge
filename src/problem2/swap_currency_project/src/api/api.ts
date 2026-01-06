import axios from "axios";

const api = axios.create({
    baseURL:"https://interview.switcheo.com/"
})

api.interceptors.request.use(
    (config)=>{
        return config;
    },
    (err)=>{
        return Promise.reject(err);
    }
)

api.interceptors.response.use(
    async(response)=>{
        return response;
    },
    async(err)=>{
        return Promise.reject(err)
    }
)

export default api;