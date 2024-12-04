import { eq } from 'drizzle-orm';
import { db } from '../config';
import { groups } from '../schema';
import { DatabaseError } from '../types';

export async function getAllGroups() {
  try {
    return await db.select().from(groups);
  } catch (error) {
    const dbError = new Error('Failed to fetch groups', { 
      cause: error 
    }) as DatabaseError;
    dbError.code = 'DB_FETCH_GROUPS_ERROR';
    throw dbError;
  }
}

export async function createGroup(name: string) {
  try {
    const id = crypto.randomUUID();
    await db.insert(groups).values({ id, name });
    return id;
  } catch (error) {
    const dbError = new Error('Failed to create group', { 
      cause: error 
    }) as DatabaseError;
    dbError.code = 'DB_CREATE_GROUP_ERROR';
    throw dbError;
  }
}