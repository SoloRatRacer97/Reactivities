import React, { Fragment, useEffect } from "react";
import { Container } from "semantic-ui-react";
import Navbar from "./Navbar";
import ActivityDashboard from "../../Features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
  // Destructuring the activityStore out of the store for now since we only need that "slice" from that part of the store
  const {activityStore} = useStore();

  useEffect(() => {
    activityStore.loadActivities()
  }, [activityStore]);

  if (activityStore.loadingIniital) return <LoadingComponent content='Loading...'></LoadingComponent>

  return (
    // Keep in mind that we should use Fragemnts for wrapping elements. I think....
    // Also, the shortcut for fragment is <>.
    <Fragment>
      <Navbar></Navbar>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
        ></ActivityDashboard>
      </Container>
    </Fragment>
  );
}
// Now this is how we get MobX to observe the changes we are making. 
export default observer(App);
