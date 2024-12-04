import { StateCreator } from 'zustand';
import { Group } from '../../types';
import * as groupQueries from '../../db/queries/groups';
import * as playerQueries from '../../db/queries/players';

export interface GroupsSlice {
  groups: Group[];
  currentGroupId: string | null;
  addGroup: (name: string) => Promise<void>;
  addPlayer: (groupId: string, name: string) => Promise<void>;
  setCurrentGroup: (groupId: string) => void;
}

export const createGroupsSlice: StateCreator<GroupsSlice> = (set, get) => ({
  groups: [],
  currentGroupId: null,

  addGroup: async (name) => {
    try {
      const id = await groupQueries.createGroup(name);
      set((state) => ({
        groups: [
          ...state.groups,
          {
            id,
            name,
            players: [],
            matches: [],
          },
        ],
        currentGroupId: state.groups.length === 0 ? id : state.currentGroupId,
      }));
    } catch (error) {
      console.error('Failed to add group:', error);
      throw error;
    }
  },

  addPlayer: async (groupId, name) => {
    const state = get();
    const group = state.groups.find((g) => g.id === groupId);
    if (!group) return;

    const playerExists = group.players.some(
      (player) => player.name.toLowerCase() === name.toLowerCase()
    );
    if (playerExists) return;

    try {
      const id = await playerQueries.createPlayer(groupId, name);
      set((state) => ({
        groups: state.groups.map((group) => {
          if (group.id !== groupId) return group;
          return {
            ...group,
            players: [
              ...group.players,
              {
                id,
                name,
                groupId,
              },
            ],
          };
        }),
      }));
    } catch (error) {
      console.error('Failed to add player:', error);
      throw error;
    }
  },

  setCurrentGroup: (groupId) => {
    set({ currentGroupId: groupId });
  },
});