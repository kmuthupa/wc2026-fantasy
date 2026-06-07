export interface Team {
  id: string;
  name: string;
  flag: string;
}

export interface Group {
  id: string;
  name: string;
  teams: Team[];
}

export const GROUPS: Group[] = [
  {
    id: 'A',
    name: 'Group A',
    teams: [
      { id: 'mex', name: 'Mexico', flag: '🇲🇽' },
      { id: 'kor', name: 'South Korea', flag: '🇰🇷' },
      { id: 'rsa', name: 'South Africa', flag: '🇿🇦' },
      { id: 'cze', name: 'Czechia', flag: '🇨🇿' },
    ],
  },
  {
    id: 'B',
    name: 'Group B',
    teams: [
      { id: 'can', name: 'Canada', flag: '🇨🇦' },
      { id: 'sui', name: 'Switzerland', flag: '🇨🇭' },
      { id: 'qat', name: 'Qatar', flag: '🇶🇦' },
      { id: 'bih', name: 'Bosnia-Herzegovina', flag: '🇧🇦' },
    ],
  },
  {
    id: 'C',
    name: 'Group C',
    teams: [
      { id: 'bra', name: 'Brazil', flag: '🇧🇷' },
      { id: 'mar', name: 'Morocco', flag: '🇲🇦' },
      { id: 'sco', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
      { id: 'hai', name: 'Haiti', flag: '🇭🇹' },
    ],
  },
  {
    id: 'D',
    name: 'Group D',
    teams: [
      { id: 'usa', name: 'USA', flag: '🇺🇸' },
      { id: 'par', name: 'Paraguay', flag: '🇵🇾' },
      { id: 'aus', name: 'Australia', flag: '🇦🇺' },
      { id: 'tur', name: 'Turkiye', flag: '🇹🇷' },
    ],
  },
  {
    id: 'E',
    name: 'Group E',
    teams: [
      { id: 'ger', name: 'Germany', flag: '🇩🇪' },
      { id: 'ecu', name: 'Ecuador', flag: '🇪🇨' },
      { id: 'civ', name: 'Ivory Coast', flag: '🇨🇮' },
      { id: 'cuw', name: 'Curacao', flag: '🇨🇼' },
    ],
  },
  {
    id: 'F',
    name: 'Group F',
    teams: [
      { id: 'ned', name: 'Netherlands', flag: '🇳🇱' },
      { id: 'jpn', name: 'Japan', flag: '🇯🇵' },
      { id: 'tun', name: 'Tunisia', flag: '🇹🇳' },
      { id: 'swe', name: 'Sweden', flag: '🇸🇪' },
    ],
  },
  {
    id: 'G',
    name: 'Group G',
    teams: [
      { id: 'bel', name: 'Belgium', flag: '🇧🇪' },
      { id: 'irn', name: 'Iran', flag: '🇮🇷' },
      { id: 'egy', name: 'Egypt', flag: '🇪🇬' },
      { id: 'nzl', name: 'New Zealand', flag: '🇳🇿' },
    ],
  },
  {
    id: 'H',
    name: 'Group H',
    teams: [
      { id: 'esp', name: 'Spain', flag: '🇪🇸' },
      { id: 'uru', name: 'Uruguay', flag: '🇺🇾' },
      { id: 'ksa', name: 'Saudi Arabia', flag: '🇸🇦' },
      { id: 'cpv', name: 'Cape Verde', flag: '🇨🇻' },
    ],
  },
  {
    id: 'I',
    name: 'Group I',
    teams: [
      { id: 'fra', name: 'France', flag: '🇫🇷' },
      { id: 'sen', name: 'Senegal', flag: '🇸🇳' },
      { id: 'nor', name: 'Norway', flag: '🇳🇴' },
      { id: 'irq', name: 'Iraq', flag: '🇮🇶' },
    ],
  },
  {
    id: 'J',
    name: 'Group J',
    teams: [
      { id: 'arg', name: 'Argentina', flag: '🇦🇷' },
      { id: 'jor', name: 'Jordan', flag: '🇯🇴' },
      { id: 'aut', name: 'Austria', flag: '🇦🇹' },
      { id: 'alg', name: 'Algeria', flag: '🇩🇿' },
    ],
  },
  {
    id: 'K',
    name: 'Group K',
    teams: [
      { id: 'por', name: 'Portugal', flag: '🇵🇹' },
      { id: 'col', name: 'Colombia', flag: '🇨🇴' },
      { id: 'uzb', name: 'Uzbekistan', flag: '🇺🇿' },
      { id: 'cod', name: 'DR Congo', flag: '🇨🇩' },
    ],
  },
  {
    id: 'L',
    name: 'Group L',
    teams: [
      { id: 'eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { id: 'cro', name: 'Croatia', flag: '🇭🇷' },
      { id: 'pan', name: 'Panama', flag: '🇵🇦' },
      { id: 'gha', name: 'Ghana', flag: '🇬🇭' },
    ],
  },
];

export const ALL_TEAMS = GROUPS.flatMap((g) => g.teams);

export type KnockoutRound = 'r32' | 'r16' | 'qf' | 'sf' | 'final';

export interface Picks {
  r32: string[]; // 16 teams who won their R32 match
  r16: string[]; // 8 teams who won their R16 match
  qf: string[];  // 4 teams who won their QF match
  sf: string[];  // 2 teams who won their SF match
  final: string; // 1 team who won the Final (Champion)
}

export interface Player {
  id: string;
  name: string;
  championPick: string; // Pre-tournament champion pick (5pt bonus)
  picks: Picks;
}

export interface Results {
  r32: string[]; // Actual 16 R32 winners
  r16: string[]; // Actual 8 R16 winners
  qf: string[];  // Actual 4 QF winners
  sf: string[];  // Actual 2 SF winners
  final: string; // Actual Champion
}

export const INITIAL_PICKS: Picks = {
  r32: [],
  r16: [],
  qf: [],
  sf: [],
  final: '',
};

export const INITIAL_RESULTS: Results = {
  r32: [],
  r16: [],
  qf: [],
  sf: [],
  final: '',
};
