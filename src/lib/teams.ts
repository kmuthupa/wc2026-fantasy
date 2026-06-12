import { ALL_TEAMS, Team } from './data';

export function getTeamById(id: string): Team | undefined {
  return ALL_TEAMS.find((t) => t.id === id);
}

export function resolveTeamId(idOrName: string): string {
  const byId = ALL_TEAMS.find((t) => t.id === idOrName);
  if (byId) return byId.id;
  const byName = ALL_TEAMS.find((t) => t.name === idOrName);
  return byName?.id ?? idOrName;
}

export function getTeamDisplay(idOrName: string): { flag: string; name: string } {
  const team =
    ALL_TEAMS.find((t) => t.id === idOrName) ??
    ALL_TEAMS.find((t) => t.name === idOrName);
  return team ? { flag: team.flag, name: team.name } : { flag: '⚽', name: idOrName };
}
