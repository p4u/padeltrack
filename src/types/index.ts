export interface Player {
  id: string;
  name: string;
  groupId: string;
}

export interface Match {
  id: string;
  groupId: string;
  timestamp: Date;
  team1: Player[];
  team2: Player[];
  scoreTeam1: number;
  scoreTeam2: number;
  isFinished: boolean;
}

export interface Group {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
}