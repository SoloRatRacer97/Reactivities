import React from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../App/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
  // activities is of type Activity:
  activities: Activity[];
  selectedActivity: Activity | undefined;
  // selectActivity takes in a string and returns void
  selectActivity: (id: string) => void;
  // cancelSelectActivity takes in nothing and returns void
  cancelSelectActivity: () => void;
  editMode: boolean;
  openForm: (id: string) => void;
  closeForm: () => void;
  createOrEdit: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}

// Use object destructuring do get the activiites out and usable for the component
export default function AvtivictyDashboard({
  activities,
  selectedActivity,
  selectActivity,
  cancelSelectActivity,
  editMode,
  openForm,
  closeForm,
  createOrEdit,
  deleteActivity
}: Props) {
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
        ></ActivityList>
      </Grid.Column>
      <Grid.Column width="6">
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            cancelSelectActivity={cancelSelectActivity}
            openForm={openForm}
          ></ActivityDetails>
        )}
        {editMode && (
          <ActivityForm
            closeForm={closeForm}
            activity={selectedActivity}
            createOrEdit={createOrEdit}
          ></ActivityForm>
        )}
      </Grid.Column>
    </Grid>
  );
}
