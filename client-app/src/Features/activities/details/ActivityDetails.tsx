import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../App/Layout/LoadingComponent";
import { useStore } from "../../../App/stores/store";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSideBar from "./ActivityDetailedSideBar";
import ActivityDetailedHeader from "./ActivityDetailedHeader";



export default observer(function ActivityDetails() {

  const {activityStore} = useStore();
  const {selectedActivity: activity, loadActivity, loadingInitial, clearSelectedActivity} = activityStore;
  const {id} = useParams();

  useEffect(() => {
    if (id) loadActivity(id);
    return () => clearSelectedActivity();
  },[id, loadActivity, clearSelectedActivity]);

  if (loadingInitial || !activity) return<LoadingComponent></LoadingComponent>

  return (
    <Grid>
      <Grid.Column width={10}>
    <ActivityDetailedHeader activity={activity}></ActivityDetailedHeader>
    <ActivityDetailedInfo activity={activity}></ActivityDetailedInfo>
    <ActivityDetailedChat activityId={activity.id}></ActivityDetailedChat>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSideBar activity={activity}></ActivityDetailedSideBar>
      </Grid.Column>
    </Grid>
  );
})
