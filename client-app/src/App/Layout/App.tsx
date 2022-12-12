import React, { Fragment, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import Navbar from "./Navbar";
import ActivityDashboard from "../../Features/activities/dashboard/ActivityDashboard";
import {v4 as uuid} from 'uuid'
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  // Here we are saying it is a type of activity, and will be an arrray.
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Little confused here... Changing the date into a more readable date type?
  useEffect(() => {
    agent.Activities.list()
      .then((response) => {
        let activities: Activity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('T')[0];
          activities.push(activity);
        })
        setActivities(response);
        setLoading(false);
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
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities, {...activity, id: uuid()}])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      }) 
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      // All the ids that are not equal tot he one that we got:
       setActivities([...activities.filter(x => x.id !== id)]);
       setSubmitting(false);
    })
    setActivities([...activities.filter(x => x.id !== id)])
  }

  if (loading) return <LoadingComponent content='Loading app'></LoadingComponent>

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
          submitting={submitting}
        ></ActivityDashboard>
      </Container>
    </Fragment>
  );
}

export default App;
