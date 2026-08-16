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
  mediaUrl?: string;
  idpTimings?: string;
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
  id?: string;
  match?: string;
  title?: string;
  startsAt?: string;
  date?: string;
  time?: string;
  map?: string;
  status?: string;
  group?: string;
};

export type AnnouncementItem = {
  id?: string;
  category: string;
  title: string;
  body?: string;
  state?: string;
  date?: string;
  pinned?: boolean;
  publishAt?: string;
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
  return (team.placement ?? 0) + (team.finishes ?? 0) - (team.penalty ?? 0);
}
