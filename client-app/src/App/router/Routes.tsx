import { createBrowserRouter, RouteObject } from "react-router-dom";
import ActivityDashboard from "../../Features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../Features/activities/form/ActivityForm";
import HomePage from "../../Features/home/HomePage";
import App from "../Layout/App";
import ActivityDetails from '../../Features/activities/details/ActivityDetails';

// Defining our routes here:
export const routes: RouteObject[] = [
      {
            // Specify a path:
            path: '/',
            // Specify what you want at that path:
            element: <App/>,
            children: [
                  {path: 'activities', element: <ActivityDashboard></ActivityDashboard>},
                  // With Raect Router 6 we do not need to worry about cascading routes like this, React will know. 
                  {path: 'activities/:id', element: <ActivityDetails></ActivityDetails>},
                  {path: 'createActivity', element: <ActivityForm key='create'></ActivityForm>},
                  {path: 'manage/:id', element: <ActivityForm key='manage'></ActivityForm>},
            ]
      }
]

export const router = createBrowserRouter(routes)