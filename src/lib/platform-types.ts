export type Status = "Registration Open" | "Closing Soon" | "Live" | "Completed" | "Full";

export type Tournament = {
  id: string;
  name: string;
  mode: string;
  status: Status;
  prize: string;
  fee: string;
  slots: number;
  registered: number;
  starts: string;
  deadline: string;
  map: string;
  phase: string;
  accent: string;
};

export type Team = {
  rank: number;
  name: string;
  short: string;
  region: string;
  captain: string;
  matches: number;
  wwcd: number;
  placement: number;
  finishes: number;
  penalty: number;
  form: string[];
  drop: string;
};

export type ScheduleItem = {
  match: string;
  date: string;
  time: string;
  map: string;
  status: string;
  group: string;
};

export type AnnouncementItem = {
  category: string;
  title: string;
  state: string;
  date: string;
};

export type PlatformData = {
  tournaments: Tournament[];
  teams: Team[];
  schedules: ScheduleItem[];
  announcements: AnnouncementItem[];
  generatedAt: string;
  source: "database" | "supabase" | "unconfigured" | "error";
  message?: string;
};

export const emptyPlatformData: PlatformData = {
  tournaments: [],
  teams: [],
  schedules: [],
  announcements: [],
  generatedAt: new Date(0).toISOString(),
  source: "unconfigured",
  message: "Live tournament operations are warming up.",
};

export function totalPoints(team: Team) {
  return team.placement + team.finishes - team.penalty;
}
