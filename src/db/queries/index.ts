import { Group, Match } from '../../types';
import { db } from '../config';
import { eq } from 'drizzle-orm';
import { groups, players, matches, matchPlayers } from '../schema';
import { prepareMatchFromDb, prepareMatchForDb } from '../utils';

export async function loadGroups(): Promise<Group[]> {
  try {
    const dbGroups = await db.select().from(groups);
    const result: Group[] = [];

    for (const group of dbGroups) {
      const dbPlayers = await db.select()
        .from(players)
        .where(eq(players.groupId, group.id));

      const dbMatches = await db.select()
        .from(matches)
        .where(eq(matches.groupId, group.id));

      const groupMatches: Match[] = [];

      for (const match of dbMatches) {
        const dbMatchPlayers = await db.select()
          .from(matchPlayers)
          .where(eq(matchPlayers.matchId, match.id));

        const team1: any[] = [];
        const team2: any[] = [];

        for (const mp of dbMatchPlayers) {
          const player = dbPlayers.find(p => p.id === mp.playerId);
          if (player) {
            const playerObj = {
              id: player.id,
              name: player.name,
              groupId: player.groupId,
            };
            if (mp.team === 1) {
              team1.push(playerObj);
            } else {
              team2.push(playerObj);
            }
          }
        }

        groupMatches.push({
          ...prepareMatchFromDb(match),
          team1,
          team2,
        });
      }

      result.push({
        id: group.id,
        name: group.name,
        players: dbPlayers.map(p => ({
          id: p.id,
          name: p.name,
          groupId: p.groupId,
        })),
        matches: groupMatches,
      });
    }

    return result;
  } catch (error) {
    console.error('Failed to load groups:', error);
    throw error;
  }
}

export { createGroup } from './groups';
export { createPlayer } from './players';
export { createMatch, updateMatchScore } from './matches';