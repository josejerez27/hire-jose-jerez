import data from "@/data/profile.json";

export type WorkRole = { company: string; title: string; dates: string; highlights: string[] };
export type Certification = { name: string; issuer: string; date: string; url?: string };
export type Place = { name: string; location: string; note: string; mapQuery?: string };
export type GrillNote = { title: string; description: string };
export type Reference = { id: string; name: string; title: string; relationship: string; message: string; letterUrl?: string };
export const profile = {
  ...data,
  workHistory: data.workHistory as WorkRole[],
  certifications: data.certifications as Certification[],
  restaurants: data.restaurants as Place[],
  trails: data.trails as Place[],
  grillNotes: data.grillNotes as GrillNote[],
  references: data.references as Reference[],
};
