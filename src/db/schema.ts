import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const players = sqliteTable('players', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id),
});

export const matches = sqliteTable('matches', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id),
  timestamp: integer('timestamp', { mode: 'number' }).notNull(),
  scoreTeam1: integer('score_team_1').notNull(),
  scoreTeam2: integer('score_team_2').notNull(),
  isFinished: integer('is_finished', { mode: 'boolean' }).notNull(),
});

export const matchPlayers = sqliteTable('match_players', {
  id: text('id').primaryKey(),
  matchId: text('match_id')
    .notNull()
    .references(() => matches.id),
  playerId: text('player_id')
    .notNull()
    .references(() => players.id),
  team: integer('team').notNull(), // 1 or 2
});