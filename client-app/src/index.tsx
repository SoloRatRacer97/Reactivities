import React from "react";
import ReactDOM from "react-dom/client";
// We are adding semantic-ui-css before our regular style sheet so that we can overwrite anything that we need to with out own styles after semantic-ui is loaded in.
import "semantic-ui-css/semantic.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // NOTE: We will be seeing two requests from React when we run our code. This is just to help us in development, but soemtimes other appolications and plugins do not play well with this.
  // We will keep this in for now but we will probably take it out in the future.
  // NOTE: We did end up turing tihs off sine Semantic UI did not like this and was throwing errors
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
