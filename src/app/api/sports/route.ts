import { summarizeSchedule, teams } from "@/lib/sports";

export async function GET() {
  const results = await Promise.all(teams.map(async team => {
    try {
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${team.sport}/teams/${team.id}/schedule`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error("Feed unavailable");
      const data = await response.json();
      if (!Array.isArray(data.events)) throw new Error("Invalid feed");
      return { ...team, games: summarizeSchedule(data.events), error: null };
    } catch { return { ...team, games: [], error: "Scores temporarily unavailable. Open the team page for updates." }; }
  }));
  return Response.json({ teams: results, checkedAt: new Date().toISOString() }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } });
}
