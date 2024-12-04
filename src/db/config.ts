import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: "https://padel-p4u1.aws-eu-west-3.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzMzMDc2NDQsImlhdCI6MTczMzMwNDA0NCwiaWQiOiI2Yjk0Nzk4YS00M2U5LTRkMGEtOGJkNS0xYmU2NTQxNjEyMzQifQ.Yrv5ozpM8MZrwS195R3Wiz0sq7QM4Dkpf9fn0SQeuR16iQxPgcriyiBqAOWUNnBcuKhJi0ZX0bwaNRANk6oeCA"
});

export const db = drizzle(client, { schema });

let initialized = false;

export async function initDb() {
  if (initialized) return;

  try {
    await client.batch([
      `CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        group_id TEXT NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )`,
      `CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY NOT NULL,
        group_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        score_team_1 INTEGER NOT NULL,
        score_team_2 INTEGER NOT NULL,
        is_finished INTEGER NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )`,
      `CREATE TABLE IF NOT EXISTS match_players (
        id TEXT PRIMARY KEY NOT NULL,
        match_id TEXT NOT NULL,
        player_id TEXT NOT NULL,
        team INTEGER NOT NULL,
        FOREIGN KEY (match_id) REFERENCES matches(id),
        FOREIGN KEY (player_id) REFERENCES players(id)
      )`
    ]);
    
    initialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}