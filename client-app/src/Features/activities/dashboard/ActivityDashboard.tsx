import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../App/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../App/Layout/LoadingComponent";
import { LOADIPHLPAPI } from "dns";

// Use object destructuring do get the activiites out and usable for the component
export default observer(function AvtivictyDashboard() {
  const { activityStore } = useStore();
  // Here we are checking to see if the activities are already loaded. If they are, we do not need to go back out to the API and make another call.
  const {loadActivities, activityRegistry} = activityStore

  // We only need to make an API call if we are loading the dashboard, so we moved the code into this file so we are only calling out to the API when we need for for the dashboard to show the activities.
  useEffect(() => {
    if (activityRegistry.size <= 1) loadActivities();
  }, [loadActivities, activityRegistry.size]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading..."></LoadingComponent>;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList></ActivityList>
      </Grid.Column>
      <Grid.Column width="6">
        <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  );
});
