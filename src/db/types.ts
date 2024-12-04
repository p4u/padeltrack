import { InferModel } from 'drizzle-orm';
import { groups, players, matches, matchPlayers } from './schema';

export type DbGroup = InferModel<typeof groups>;
export type DbPlayer = InferModel<typeof players>;
export type DbMatch = InferModel<typeof matches>;
export type DbMatchPlayer = InferModel<typeof matchPlayers>;

export interface DatabaseError extends Error {
  code?: string;
  cause?: unknown;
}