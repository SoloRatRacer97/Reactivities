// Axios is conencting our client side requests to our API. 
import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

// setting up a sleep function that takes a number and then sets a timeout for that specified number of miliseconds
const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "http://localhost:5000/api";

// Delay manualy made with axios to simulate grabbing data from a server.
axios.interceptors.response.use(async (response) => {
  try {
    await sleep(1000);
    return response;
    // Sending the error and returing the promise if it fails:
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
});

// The <T> defines the type for this file. Then, we can use it below to specify the type.
// The <T> is a "generic type" that we can reuse over and over again
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// Define requests for axios here where we pass back the data
const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

// Define a function for each of the functions we are going to use in our app:
const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => axios.post<void>('/activities', activity),
  update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => axios.delete<void>(`/activities/${id}`)
}

// Just naming Activities under one variable, agent:
// Why...?
const agent = {
  Activities,
};

export default agent;
