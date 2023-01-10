import React, { Fragment, useEffect } from "react";
import { Container } from "semantic-ui-react";
import Navbar from "./Navbar";
import ActivityDashboard from "../../Features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import HomePage from "../../Features/home/HomePage";
import { ToastContainer } from "react-toastify";
import ModalContainer from "../../Features/activities/common/modal/ModalContainer";

function App() {
  const location = useLocation();

  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded())
    } else {
      commonStore.setAppLoaded()
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading App...'></LoadingComponent>

  return (
    // Keep in mind that we should use Fragemnts for wrapping elements. I think....
    // Also, the shortcut for fragment is <>.
    <Fragment>
      {/* Simple scroll restoration: */}
      <ScrollRestoration></ScrollRestoration>
      <ModalContainer></ModalContainer>
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
