import { joseProfile as profile } from "./jose-profile";

export type ChatMessage = { role: "user" | "assistant"; content: string };

const contact = `For more details, contact Jose at ${profile.email}.`;
const projectAnswer = (index: number) => {
  const project = profile.projects[index];
  return `${project.title}\n${project.description}\n\nPlatforms: ${project.tag}.`;
};

// Prepared responses only quote known facts. Keyword matches never establish a new skill.
const answers = [
  { matches: /\b(asset|recovery|equipment|fedex|return labels?)\b/i, answer: () => projectAnswer(0) },
  { matches: /\b(verifications?|applicants?|duplicate|intake)\b/i, answer: () => projectAnswer(1) },
  { matches: /\b(sla|response times?|escalations?|reminders?)\b/i, answer: () => projectAnswer(2) },
  { matches: /\b(distribution|mailing lists?|request portal|service catalog)\b/i, answer: () => projectAnswer(3) },
  { matches: /\bservicenow\b/i, answer: () => `Jose lists ServiceNow among his skills. His projects include:\n\n${[0, 1, 3].map((index) => projectAnswer(index)).join("\n\n")}` },
  { matches: /\b(projects?|built|build|automations?|workflows?)\b/i, answer: () => `Jose’s featured automation projects:\n\n${profile.projects.map((project) => `• ${project.title}: ${project.description}`).join("\n\n")}` },
  { matches: /\b(roles?|positions?|opportunities|looking for|interested in|hiring|hire)\b/i, answer: () => `Jose is interested in ${profile.rolesOfInterest.join(", ")} opportunities. ${contact}` },
  { matches: /\b(contact|email|connect|reach|github)\b/i, answer: () => `Email: ${profile.email}\nGitHub: ${profile.github}` },
  { matches: /\b(skills?|technolog\w*|platforms?|tools?|okta|identity|iam|sso|saml|mfa|saas|workday|kandji|meraki|genesys|microsoft|google|apis?|python|javascript|rust|programming)\b/i, answer: () => `Jose’s listed skills and platforms include:\n\n${profile.skills.join(", ")}.\n\nIf you’re asking about a skill beyond this list, the portfolio doesn’t confirm it. ${contact}` },
  { matches: /\b(experience|background|years?|employees?|workforce|tickets?|accomplishments?|impact|metrics|achievements?)\b/i, answer: () => `${profile.summary}\n\nHis portfolio lists ${profile.experience}, support for ${profile.workforceSupported}, and ${profile.ticketsResolved} tickets resolved.\n\n${profile.responseTime}` },
  { matches: /\b(hobb\w*|interests?|family|outside|baseball|football|hiking|camping|cooking)\b/i, answer: () => profile.interests },
  { matches: /^(hi|hello|hey|who is jose|tell me about jose|what can you do)[!?.\s]*$/i, answer: () => `${profile.summary}\n\nYou can ask about his automation projects, skills, experience, role interests, or contact details.` },
];

export function getPortfolioAnswer(messages: ChatMessage[]): string {
  const question = messages[messages.length - 1].content.trim();
  // These details are not present in the portfolio, even when the question also names a skill.
  if (/\b(salary|compensation|pay|certifi\w*|degree|education|college|university|employers?|companies|work authorization|visa|location|live[sd]?|available|availability|start date)\b|where (?:does|did|has) (?:he|jose) work/i.test(question)) {
    return `That detail isn’t listed in Jose’s portfolio. ${contact}`;
  }
  const match = answers.find((entry) => entry.matches.test(question));
  if (match) return match.answer();

  // Resolve a simple follow-up to the last explicit user topic, never to invented assistant facts.
  if (/^(tell me more|more details|expand|go on|what about (?:that|it)|how did (?:he|jose) do (?:that|it))[!?.\s]*$/i.test(question)) {
    const previous = [...messages.slice(0, -1)].reverse().find((message) =>
      message.role === "user" && answers.some((entry) => entry.matches.test(message.content)));
    const topic = previous && answers.find((entry) => entry.matches.test(previous.content));
    if (topic) return `${topic.answer()}\n\nThat’s the detail currently listed in the portfolio. ${contact}`;
  }
  return `I can share prepared answers about Jose’s projects, skills, experience, and role interests. Try “What automation projects has Jose built?” or “What is his ServiceNow experience?”\n\nFor anything beyond the portfolio, ${contact}`;
}
