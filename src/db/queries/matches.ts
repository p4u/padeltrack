import { eq } from 'drizzle-orm';
import { db } from '../config';
import { matches, matchPlayers } from '../schema';
import { DatabaseError } from '../types';
import { Match } from '../../types';
import { prepareMatchForDb } from '../utils';

export async function getMatchesByGroupId(groupId: string) {
  try {
    return await db.select()
      .from(matches)
      .where(eq(matches.groupId, groupId));
  } catch (error) {
    const dbError = new Error('Failed to fetch matches', { 
      cause: error 
    }) as DatabaseError;
    dbError.code = 'DB_FETCH_MATCHES_ERROR';
    throw dbError;
  }
}

export async function createMatch(match: Match) {
  try {
    await db.transaction(async (tx) => {
      // Insert match
      await tx.insert(matches).values(prepareMatchForDb(match));

      // Insert match players
      const allPlayers = [...match.team1, ...match.team2];
      for (let i = 0; i < allPlayers.length; i++) {
        const player = allPlayers[i];
        const team = i < 2 ? 1 : 2;
        await tx.insert(matchPlayers).values({
          id: crypto.randomUUID(),
          matchId: match.id,
          playerId: player.id,
          team,
        });
      }
    });
  } catch (error) {
    const dbError = new Error('Failed to create match', { 
      cause: error 
    }) as DatabaseError;
    dbError.code = 'DB_CREATE_MATCH_ERROR';
    throw dbError;
  }
}

export async function updateMatchScore(
  matchId: string, 
  scoreTeam1: number, 
  scoreTeam2: number
) {
  try {
    await db.update(matches)
      .set({ scoreTeam1, scoreTeam2, isFinished: true })
      .where(eq(matches.id, matchId));
  } catch (error) {
    const dbError = new Error('Failed to update match score', { 
      cause: error 
    }) as DatabaseError;
    dbError.code = 'DB_UPDATE_MATCH_ERROR';
    throw dbError;
  }
}