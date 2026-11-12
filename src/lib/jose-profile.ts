import data from "../data/profile.json";

// Keep the website, résumé, AI context, and prepared answers on the same facts.
export const projects = data.projects;
export const skills = data.skills;
const metric = (label: string) => data.metrics.find((item) => item.label === label)?.value ?? "Not listed";
export const joseProfile = {
  ...data,
  projects,
  skills,
  workforceSupported: `${metric("Employees supported")} employees`,
  ticketsResolved: metric("Tickets resolved"),
  experience: `${data.yearsExperience} years in IT (exact employment dates are not provided)`,
  responseTime: `Overall average first response: ${metric("Average first response")}. Overall average resolution: ${metric("Average resolution")}. SLA automation project: first response improved from approximately 18–19 minutes to 5–8 minutes.`,
  rolesOfInterest: ["IT Operations", "Systems Administration", "Enterprise Applications", "IAM", "SaaS Administration", "ServiceNow"],
  interests: data.interests,
};
