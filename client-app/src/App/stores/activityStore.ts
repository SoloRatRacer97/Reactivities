// This is where we are using state management, similar to Redux, for our App.
// MobX uses typescript and is better for building small apps that are simpler. It does not come with as much boilerplate code as Redux and offers a simpler developer experience. 
// ***Anything enterprise should probably be using Redux though***

// Recall: to get components to talk to the activityStore, we need to wrap them in an observer. That way, the componentns 'observe' what is going on an can report back to the state.
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

// This is a specific store class that houses specific data. We can make as many of these as we want and are kind of like context slices for MobX.
export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity?: Activity = undefined;
  editMode = false;
  loading = false;
  loadingIniital = true;

  constructor() {
    // By making this auto oberservable, we can let MobX figure out that we need to use this class as an observable
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
  }

  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        activity.date = activity.date.split("T")[0];
        // Recall: Redux is an immutable state managemnt library and you cannot manipulate state in Redux. But in Mobx, we can like with the following code:
        this.activityRegistry.set(activity.id, activity)
        this.setLoadingInitial(false);
      });
      this.loadingIniital = false;
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingIniital = state;
  };

  selectActivity = (id: string) => {
      this.selectedActivity = this.activityRegistry.get(id)
  }

  cancelSelectedActivity = () => {
      this.selectedActivity = undefined;
  }
  // Recall that we can make the id optional here and set it to undefined if we do not get one, like in the create form handler. Then, we pass the turnary operator below and just canceled the selected form and turn on edit mode. 
  openForm = (id?: string) => {
      id ? this.selectActivity(id) : this.cancelSelectedActivity();
      this.editMode = true;
  }

  closeForm = () => {
      this.editMode = false;
  }

  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity)
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity)
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        if (this.selectedActivity?.id === id) this.cancelSelectedActivity()
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }
}
