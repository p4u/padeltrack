import { eq } from 'drizzle-orm';
import { db } from '../config';
import { players } from '../schema';
import { DatabaseError } from '../types';

export async function getPlayersByGroupId(groupId: string) {
  try {
    return await db.select()
      .from(players)
      .where(eq(players.groupId, groupId));
  } catch (error) {
    const dbError = new Error('Failed to fetch players', { 
      cause: error 
    }) as DatabaseError;
    dbError.code = 'DB_FETCH_PLAYERS_ERROR';
    throw dbError;
  }
}

export async function createPlayer(groupId: string, name: string) {
  try {
    const id = crypto.randomUUID();
    await db.insert(players).values({ id, name, groupId });
    return id;
  } catch (error) {
    const dbError = new Error('Failed to create player', { 
      cause: error 
    }) as DatabaseError;
    dbError.code = 'DB_CREATE_PLAYER_ERROR';
    throw dbError;
  }
}