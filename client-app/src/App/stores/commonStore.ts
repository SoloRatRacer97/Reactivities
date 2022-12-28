import { ServerError } from "../models/serverError";
import { makeAutoObservable, reaction } from "mobx";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = localStorage.getItem("jwt");
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);

    // This reaction in MobX allows us to react to when the page is updated. NOT when it initially runs. Mobx does have that functionality, but not in this implimnetation
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem("jwt", token);
        } else localStorage.removeItem("jwt");
      }
    );
  }

  setServerError(error: ServerError) {
    this.error = error;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  setAppLoaded() {
    this.appLoaded = true;
  }
}
