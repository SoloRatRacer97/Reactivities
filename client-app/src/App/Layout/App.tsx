import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import Navbar from "./Navbar";
import ActivityDashboard from "../../Features/activities/dashboard/ActivityDashboard";
import {v4 as uuid} from 'uuid'

function App() {
  // Here we are saying it is a type of activity, and will be an arrray.
  const [activities, setActivities] = useState<Activity[]>([]);

  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Again, making the return value of type Activity and an array.
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);

  function HandleSelectActivity(id: string) {
    // Grabbing the correct activity with where the ids match
    setSelectedActivity(activities.find((x) => x.id === id));
  }

  function HandleCancelSelectedActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    // This resets the selected activity. If there is an ID provided, it gets selected. If no id is provided, then we just ensure that no id is selected. 
    id ? HandleSelectActivity(id) : HandleCancelSelectedActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    // Setting the actiivty to the selected one if there is one. If not, we are setting it to a blank activity I think...?
    activity.id ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
    // Blank activity part..?:
    : setActivities([...activities, {...activity, id: uuid()}])

    setEditMode(false);
    setSelectedActivity(activity)
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)])
  }

  return (
    // Keep in mind that we should use Fragemnts for wrapping elements. I think....
    // Also, the shortcut for fragment is <>.
    <Fragment>
      <Navbar openForm={handleFormOpen}></Navbar>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={HandleSelectActivity}
          cancelSelectActivity={HandleCancelSelectedActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        ></ActivityDashboard>
      </Container>
    </Fragment>
  );
}

export default App;
