export const teams = [
  { name: "Los Angeles Dodgers", short: "Dodgers", sport: "baseball/mlb", id: "lad", league: "MLB", url: "https://www.espn.com/mlb/team/_/name/lad/los-angeles-dodgers" },
  { name: "Dallas Cowboys", short: "Cowboys", sport: "football/nfl", id: "dal", league: "NFL", url: "https://www.espn.com/nfl/team/_/name/dal/dallas-cowboys" },
  { name: "Utah Mammoth", short: "Mammoth", sport: "hockey/nhl", id: "utah", league: "NHL", url: "https://www.espn.com/nhl/team/_/name/utah/utah-mammoth" },
  { name: "Utah Jazz", short: "Jazz", sport: "basketball/nba", id: "utah", league: "NBA", url: "https://www.espn.com/nba/team/_/name/utah/utah-jazz" },
];
type Event = { id: string; date: string; name: string; competitions?: { status?: { type?: { state?: string; shortDetail?: string } }; competitors?: { team?: { abbreviation?: string }; score?: string | { displayValue?: string } }[] }[] };
export function summarizeSchedule(events: Event[], now = Date.now()) {
  return events.filter(e => e?.date && Number.isFinite(Date.parse(e.date)))
    .sort((a, b) => {
      const activeA = a.competitions?.[0]?.status?.type?.state === "in";
      const activeB = b.competitions?.[0]?.status?.type?.state === "in";
      if (activeA !== activeB) return activeA ? -1 : 1;
      return Math.abs(Date.parse(a.date) - now) - Math.abs(Date.parse(b.date) - now);
    }).slice(0, 2).map(event => {
      const competition = event.competitions?.[0];
      const state = competition?.status?.type?.state ?? "pre";
      return { id: event.id, name: event.name, date: event.date, state, status: competition?.status?.type?.shortDetail ?? "Scheduled", scores: state === "pre" ? "" : (competition?.competitors ?? []).map(c => `${c.team?.abbreviation ?? "Team"} ${typeof c.score === "object" ? c.score.displayValue ?? "–" : c.score ?? "–"}`).join(" · ") };
    });
}
export type SportsFeed = { checkedAt: string; teams: (typeof teams[number] & { games: ReturnType<typeof summarizeSchedule>; error: string | null })[] };
