import { db } from './config';
import { sql } from 'drizzle-orm';

let initialized = false;

export async function initDatabase() {
  if (initialized) return db;

  try {
    // Test database connection and create tables if they don't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        group_id TEXT NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      );

      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY NOT NULL,
        group_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        score_team_1 INTEGER NOT NULL,
        score_team_2 INTEGER NOT NULL,
        is_finished INTEGER NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      );

      CREATE TABLE IF NOT EXISTS match_players (
        id TEXT PRIMARY KEY NOT NULL,
        match_id TEXT NOT NULL,
        player_id TEXT NOT NULL,
        team INTEGER NOT NULL,
        FOREIGN KEY (match_id) REFERENCES matches(id),
        FOREIGN KEY (player_id) REFERENCES players(id)
      );
    `);

    console.log('Database initialized successfully');
    initialized = true;
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}