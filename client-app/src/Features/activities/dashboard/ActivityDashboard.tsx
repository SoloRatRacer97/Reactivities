import React from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import { useStore } from "../../../App/stores/store";
import { observer } from "mobx-react-lite";

// Use object destructuring do get the activiites out and usable for the component
export default observer(function AvtivictyDashboard() {

  const {activityStore} = useStore();
  const {selectedActivity, editMode} = activityStore;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList
        ></ActivityList>
      </Grid.Column>
      <Grid.Column width="6">
        {selectedActivity && !editMode && (
          <ActivityDetails
          ></ActivityDetails>
        )}
        {editMode && (
          <ActivityForm
          ></ActivityForm>
        )}
      </Grid.Column>
    </Grid>
  );
})
