import { createContext, useContext } from 'react';
import ActivityStore from './activityStore';
import CommonStore from './commonStore';

// This is making a store "handler" so we can impliment our store

// Making an interface to hold all of our stores
interface Store {
      activityStore: ActivityStore
      commonStore: CommonStore
}

export const store: Store = {
      // Adding different stores into our store variable so we can access multiple of them
      activityStore: new ActivityStore(),
      commonStore: new CommonStore()
}

// It looks like we are exporting the store into context
export const StoreContext = createContext(store);

// Custom React Hook to process our store:
// Again, it looks like we are just using cotnext here.... Little odd?
export function useStore() {
      return useContext(StoreContext);
}