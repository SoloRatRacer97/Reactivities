// Axios is conencting our client side requests to our API. This will make a bunch of methods that we can call whenever we need to have our frontend talk to our backend. 

// Recall: Axios is kind of our fetch api for this project. Just a bit cleaner than JS's regular fetch apparently. 
import axios, { AxiosError, AxiosResponse } from "axios";
import { config } from "process";
import { toast } from "react-toastify";

import { Activity, ActivityFormValues } from '../models/activity';
import { Photo, Profile } from "../models/profile";
import { User, UserFormValues } from "../models/user";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { Form } from 'semantic-ui-react';

// setting up a sleep function that takes a number and then sets a timeout for that specified number of miliseconds
const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

// Setting base url to save us some typing
axios.defaults.baseURL = "http://localhost:5000/api";

// This is a generic type. This way when we make the specific responses below, we can specify the typefor each activity request. This way we can ensure we are getting the correct data back and it fits the type we want.
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
  const token = store.commonStore.token

  // Setting the header with the token...? Not sure why...
  // I think it is to send the token with each request so the server knows that we are authorized for our actions
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config;
})

// Delay manualy made with axios to simulate grabbing data from a server.
axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        // This is to send the user to a not found page if they dont have a valid Guid 
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          router.navigate("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        } else {
          toast.error(data);
        }
        break;
      case 401:
        toast.error("unauthorized");
        break;
      case 403:
        toast.error("forbidden");
        break;
      case 404:
        router.navigate("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        router.navigate("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);

// Define requests for axios here where we pass back the data
const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

// Define a HTTP function for each of the functions we are going to use in our app:
const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => requests.post<void>("/activities", activity),
  update: (activity: ActivityFormValues) => 
  requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
};

// Defining a function to get the current user, log them in, and/or register them
const Account = {
  current: () => requests.get<User>('/account'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: any) => {
      let formData = new FormData();
      formData.append('File', file);
      return axios.post<Photo>('photos', formData, {
          headers: {'Content-Type': 'multipart/form-data'}
      })
  },
  setMainPhoto: (id: string) => axios.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => axios.delete(`/photos/${id}`)
}

// Naming this class under agent and exporting it:
const agent = {
  Activities,
  Account,
  Profiles
};

export default agent;
