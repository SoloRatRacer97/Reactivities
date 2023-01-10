import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import ActivityDashboard from "../../Features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../Features/activities/common/form/ActivityForm";
import App from "../Layout/App";
import ActivityDetails from "../../Features/activities/details/ActivityDetails";
import TestErrors from "../../Features/errors/TestError";
import NotFound from "../../Features/errors/NotFound";
import ServerError from "../../Features/errors/ServerError";
import ProfilePage from "../../Features/profiles/ProfilePage";
import RequireAuth from "./RequireAuth";

// Defining our routes here:
export const routes: RouteObject[] = [
  {
    // Specify a path:
    path: "/",
    // Specify what you want at that path:
    element: <App />,
    children: [
      // Putting these elements inside the RequireAtuth allows us to redirect the user around when they are not signed in:
      {element: <RequireAuth></RequireAuth>, children: [
        { path: "activities", element: <ActivityDashboard></ActivityDashboard> },
        // With Raect Router 6 we do not need to worry about cascading routes like this, React will know.
        { path: "activities/:id", element: <ActivityDetails></ActivityDetails> },
        {
          path: "createActivity",
          element: <ActivityForm key="create"></ActivityForm>,
        },
        {
          path: "manage/:id",
          element: <ActivityForm key="manage"></ActivityForm>,
        },
        {
          path: "profiles/:username",
          element: <ProfilePage></ProfilePage>,
        },
      ]},

      { path: "errors", element: <TestErrors></TestErrors> },
      { path: "not-found", element: <NotFound></NotFound> },
      // This is the default path for anything that is not defined. We are just sending them to the not-found page right now
      { path: "server-error", element: <ServerError></ServerError> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
