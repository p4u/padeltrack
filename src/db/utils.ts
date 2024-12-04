import { Match } from '../types';

export function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export function prepareMatchForDb(match: Match) {
  return {
    id: match.id,
    groupId: match.groupId,
    timestamp: dateToTimestamp(match.timestamp),
    scoreTeam1: match.scoreTeam1,
    scoreTeam2: match.scoreTeam2,
    isFinished: match.isFinished,
  };
}

export function prepareMatchFromDb(dbMatch: any): Partial<Match> {
  return {
    id: dbMatch.id,
    groupId: dbMatch.groupId,
    timestamp: timestampToDate(dbMatch.timestamp),
    scoreTeam1: dbMatch.scoreTeam1,
    scoreTeam2: dbMatch.scoreTeam2,
    isFinished: Boolean(dbMatch.isFinished),
  };
}