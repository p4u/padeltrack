import { create } from 'zustand';
import { GroupsSlice, createGroupsSlice } from './slices/groups';
import { MatchesSlice, createMatchesSlice } from './slices/matches';
import * as db from '../db/queries';

interface Store extends GroupsSlice, MatchesSlice {
  loadInitialData: () => Promise<void>;
}

export const useStore = create<Store>((set, get, ...args) => ({
  ...createGroupsSlice(set, get, ...args),
  ...createMatchesSlice(set, get, ...args),

  loadInitialData: async () => {
    try {
      const groups = await db.loadGroups();
      set({ groups });
      if (groups.length > 0 && !get().currentGroupId) {
        set({ currentGroupId: groups[0].id });
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
      throw error;
    }
  },
}));

// Load initial data when the store is created
useStore.getState().loadInitialData().catch(error => {
  console.error('Failed to load initial data:', error);
});