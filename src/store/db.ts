import { db } from '../db/config';
import { groups, players, matches, matchPlayers } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Group, Match, Player } from '../types';
import { prepareMatchForDb, prepareMatchFromDb } from '../db/utils';

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

        const team1: Player[] = [];
        const team2: Player[] = [];

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

export async function saveGroup(name: string): Promise<string> {
  try {
    const id = crypto.randomUUID();
    await db.insert(groups).values({ id, name });
    return id;
  } catch (error) {
    console.error('Failed to save group:', error);
    throw error;
  }
}

export async function savePlayer(groupId: string, name: string): Promise<string> {
  try {
    const id = crypto.randomUUID();
    await db.insert(players).values({ id, name, groupId });
    return id;
  } catch (error) {
    console.error('Failed to save player:', error);
    throw error;
  }
}

export async function saveMatch(match: Match): Promise<void> {
  try {
    await db.insert(matches).values(prepareMatchForDb(match));

    const allPlayers = [...match.team1, ...match.team2];
    for (let i = 0; i < allPlayers.length; i++) {
      const player = allPlayers[i];
      const team = i < 2 ? 1 : 2;
      await db.insert(matchPlayers).values({
        id: crypto.randomUUID(),
        matchId: match.id,
        playerId: player.id,
        team,
      });
    }
  } catch (error) {
    console.error('Failed to save match:', error);
    throw error;
  }
}

export async function updateMatch(match: Match): Promise<void> {
  try {
    await db.update(matches)
      .set(prepareMatchForDb(match))
      .where(eq(matches.id, match.id));
  } catch (error) {
    console.error('Failed to update match:', error);
    throw error;
  }
}