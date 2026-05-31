import type { TranslationKey } from '@/i18n';
import type { Team } from '@/models';

type Translate = (key: TranslationKey) => string;

const teamNameKeys = {
  ALG: 'v1.team.name.ALG',
  ARG: 'v1.team.name.ARG',
  AUS: 'v1.team.name.AUS',
  AUT: 'v1.team.name.AUT',
  BEL: 'v1.team.name.BEL',
  BIH: 'v1.team.name.BIH',
  BRA: 'v1.team.name.BRA',
  CAN: 'v1.team.name.CAN',
  CIV: 'v1.team.name.CIV',
  COD: 'v1.team.name.COD',
  COL: 'v1.team.name.COL',
  CPV: 'v1.team.name.CPV',
  CRO: 'v1.team.name.CRO',
  CUW: 'v1.team.name.CUW',
  CZE: 'v1.team.name.CZE',
  ECU: 'v1.team.name.ECU',
  EGY: 'v1.team.name.EGY',
  ENG: 'v1.team.name.ENG',
  ESP: 'v1.team.name.ESP',
  FRA: 'v1.team.name.FRA',
  GER: 'v1.team.name.GER',
  GHA: 'v1.team.name.GHA',
  HAI: 'v1.team.name.HAI',
  IRN: 'v1.team.name.IRN',
  IRQ: 'v1.team.name.IRQ',
  JOR: 'v1.team.name.JOR',
  JPN: 'v1.team.name.JPN',
  KOR: 'v1.team.name.KOR',
  KSA: 'v1.team.name.KSA',
  MAR: 'v1.team.name.MAR',
  MEX: 'v1.team.name.MEX',
  NED: 'v1.team.name.NED',
  NOR: 'v1.team.name.NOR',
  NZL: 'v1.team.name.NZL',
  PAN: 'v1.team.name.PAN',
  PAR: 'v1.team.name.PAR',
  POR: 'v1.team.name.POR',
  QAT: 'v1.team.name.QAT',
  RSA: 'v1.team.name.RSA',
  SCO: 'v1.team.name.SCO',
  SEN: 'v1.team.name.SEN',
  SUI: 'v1.team.name.SUI',
  SWE: 'v1.team.name.SWE',
  TUN: 'v1.team.name.TUN',
  TUR: 'v1.team.name.TUR',
  URU: 'v1.team.name.URU',
  USA: 'v1.team.name.USA',
  UZB: 'v1.team.name.UZB',
} as const satisfies Record<string, TranslationKey>;

export const translateTeamName = (team: Team, t: Translate) => {
  const key = teamNameKeys[team.code as keyof typeof teamNameKeys];

  return key ? t(key) : team.name;
};
