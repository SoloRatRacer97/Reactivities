// This is where we are using state management, similar to Redux, for our App.
// MobX uses typescript and is better for building small apps that are simpler. It does not come with as much boilerplate code as Redux and offers a simpler developer experience.
// ***Anything enterprise should probably be using Redux though***

// Recall: to get components to talk to the activityStore, we need to wrap them in an observer. That way, the componentns 'observe' what is going on an can report back to the state.
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from "uuid";

// This is a specific store class that houses specific data. We can make as many of these as we want and are kind of like context slices for MobX.
export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity?: Activity = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    // By making this auto oberservable, we can let MobX figure out that we need to use this class as an observable
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  // IDK what the hell is going on here. Looks like we are grouping activities and returning them in an array that has the same elements, but is now grouped a certain way.
  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = activity.date;
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as {[key: string]: Activity[]})
    )
  }

  loadActivities = async () => {
    this.setLoadingInitial(true)
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
      this.setActivity(activity)
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  // To load one activity for when we click on the View button:
  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    }
    // If we dont find an activity with that id:
    else {
      this.loadingInitial = true;
      try {
        this.setLoadingInitial(true);
        // Recall that agent is used to make api calls with Axios. So if we dont get the activity from the list in the browser, we can try to get it from the backend. Again, dont know why we would want to do this....?
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => {
          this.selectedActivity = activity
        });
        this.setLoadingInitial(false);
        return activity
      } catch (error) {
        console.log(error);
        this.loadingInitial = false
      }
    }
  };

  // This just grabs the id or retruns undefined if it is not found. Then we would need to return it from the API. But why would it not just be there in the activiites...? I guess this is just validating that we are pulling it from the activites we found..
  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  private setActivity = (activity: Activity) => {
    // Again, making the date more readable and resetting it:
    activity.date = activity.date.split("T")[0];
    // Making the registry set to the activity we are working with now. 
    this.activityRegistry.set(activity.id, activity);
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}