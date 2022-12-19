import React, { Fragment, useEffect } from "react";
import { Container } from "semantic-ui-react";
import Navbar from "./Navbar";
import ActivityDashboard from "../../Features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../Features/home/HomePage";
import { ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();

  return (
    // Keep in mind that we should use Fragemnts for wrapping elements. I think....
    // Also, the shortcut for fragment is <>.
    <Fragment>
      <ToastContainer position="bottom-right" hideProgressBar theme='colored'></ToastContainer>
      {location.pathname === "/" ? (
        <HomePage></HomePage>
      ) : (
        <Fragment>
          <Navbar></Navbar>
          <Container style={{ marginTop: "7em" }}>
            {/* This is setting up an outlet for our router. This will render the page that we need after router sends the correct one */}
            <Outlet />
          </Container>
        </Fragment>
      )}
    </Fragment>
  );
}
// Now this is how we get MobX to observe the changes we are making.
export default observer(App);
