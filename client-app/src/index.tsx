import React from "react";
import ReactDOM from "react-dom/client";
// We are adding semantic-ui-css before our regular style sheet so that we can overwrite anything that we need to with out own styles after semantic-ui is loaded in.
import "semantic-ui-css/semantic.min.css";
import "./App/Layout/styles.css";
import reportWebVitals from "./reportWebVitals";
import { store, StoreContext } from "./App/stores/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./App/router/Routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // Providing our store to the application by wrapping the app component at the top level in index. 
  <StoreContext.Provider value={store}>
    <RouterProvider router={router}></RouterProvider>
  </StoreContext.Provider>
);

reportWebVitals();
