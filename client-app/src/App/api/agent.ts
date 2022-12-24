// Axios is conencting our client side requests to our API.
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { Activity } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { router } from "../router/Routes";
import { store } from "../stores/store";

// setting up a sleep function that takes a number and then sets a timeout for that specified number of miliseconds
const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

// Setting base url to save us some typing
axios.defaults.baseURL = "http://localhost:5000/api";

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

// This is a generic type. This way when we make the specific responses below, we can specify the typefor each activity request. This way we can ensure we are getting the correct data back and it fits the type we want.
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

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
  create: (activity: Activity) => axios.post<void>("/activities", activity),
  update: (activity: Activity) =>
    axios.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => axios.delete<void>(`/activities/${id}`),
};

const Account = {
  current: () => requests.get<User>('/acount'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

// Naming this class under agent and exporting it:
const agent = {
  Activities,
  Account
};

export default agent;
