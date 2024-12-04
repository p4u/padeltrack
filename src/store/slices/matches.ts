import { StateCreator } from 'zustand';
import { Match } from '../../types';
import * as matchQueries from '../../db/queries/matches';
import { GroupsSlice } from './groups';

export interface MatchesSlice {
  startMatch: (groupId: string, playerIds: string[]) => Promise<void>;
  submitMatchResult: (matchId: string, scoreTeam1: number, scoreTeam2: number) => Promise<void>;
}

export const createMatchesSlice: StateCreator<
  MatchesSlice & GroupsSlice
> = (set, get) => ({
  startMatch: async (groupId, playerIds) => {
    if (playerIds.length !== 4) return;

    const state = get();
    const group = state.groups.find((g) => g.id === groupId);
    if (!group) return;

    const players = group.players.filter((player) =>
      playerIds.includes(player.id)
    );
    
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const team1 = shuffledPlayers.slice(0, 2);
    const team2 = shuffledPlayers.slice(2);

    const match: Match = {
      id: crypto.randomUUID(),
      groupId,
      timestamp: new Date(),
      team1,
      team2,
      scoreTeam1: 0,
      scoreTeam2: 0,
      isFinished: false,
    };

    try {
      await matchQueries.createMatch(match);
      set((state) => ({
        groups: state.groups.map((group) => {
          if (group.id !== groupId) return group;
          return {
            ...group,
            matches: [...group.matches, match],
          };
        }),
      }));
    } catch (error) {
      console.error('Failed to start match:', error);
      throw error;
    }
  },

  submitMatchResult: async (matchId, scoreTeam1, scoreTeam2) => {
    try {
      await matchQueries.updateMatchScore(matchId, scoreTeam1, scoreTeam2);
      set((state) => ({
        groups: state.groups.map((group) => ({
          ...group,
          matches: group.matches.map((match) =>
            match.id === matchId
              ? { ...match, scoreTeam1, scoreTeam2, isFinished: true }
              : match
          ),
        })),
      }));
    } catch (error) {
      console.error('Failed to submit match result:', error);
      throw error;
    }
  },
});