import { createContext, useContext } from 'react';
import ActivityStore from './activityStore';

// This is making a store "handler" so we can impliment our store

// Making an interface from ActivityStore
interface Store {
      activityStore: ActivityStore
}

export const store: Store = {
      // Adding different stores into our store variable so we can access multiple of them
      activityStore: new ActivityStore()
}

// Exporting them to use in our app:
export const StoreContext = createContext(store);

// Custom React Hook to process our store:
export function useStore() {
      return useContext(StoreContext);
}