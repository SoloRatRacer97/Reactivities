import React, { useEffect } from "react";
import { Button, Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../App/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../App/Layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";
import { useState } from "react";
import { PagingParams } from "../../../App/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

// Use object destructuring do get the activiites out and usable for the component
export default observer(function AvtivictyDashboard() {
  const { activityStore } = useStore();
  // Here we are checking to see if the activities are already loaded. If they are, we do not need to go back out to the API and make another call.
  const { loadActivities, activityRegistry, setPagingParams, pagination } =
    activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  // Setting up infinite scroll:
  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  }

  // We only need to make an API call if we are loading the dashboard, so we moved the code into this file so we are only calling out to the API when we need for for the dashboard to show the activities.
  useEffect(() => {
    if (activityRegistry.size <= 1) loadActivities();
  }, [loadActivities, activityRegistry.size]);

  return (
    <Grid>
      <Grid.Column width="10">
        {activityStore.loadingInitial && !loadingNext ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={
              !loadingNext &&
              !!pagination &&
              pagination.currentPage < pagination.totalPages
            }
            initialLoad={false}
          >
            <ActivityList></ActivityList>
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters></ActivityFilters>
      </Grid.Column>
      <Grid.Column>
        <Loader active={loadingNext}></Loader>
      </Grid.Column>
    </Grid>
  );
});
