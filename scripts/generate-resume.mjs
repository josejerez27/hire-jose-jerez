import { readFile, writeFile } from "node:fs/promises";

const profile = JSON.parse(await readFile(new URL("../src/data/profile.json", import.meta.url), "utf8"));
const clean = text => String(text).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[–—]/g, "-").replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/·/g, " | ").replace(/[^\x20-\x7e\n]/g, "");
const escape = text => clean(text).replace(/([\\()])/g, "\\$1");
const rows = [];
function line(text, size = 9.5, bold = false, gap = 13) { rows.push({ text: clean(text), size, bold, gap }); }
function wrap(text, width = 99, size = 9.5) {
  const words = clean(text).split(/\s+/); let current = "";
  for (const word of words) { if ((current + " " + word).length > width && current) { line(current, size); current = word; } else current += (current ? " " : "") + word; }
  if (current) line(current, size);
}
function heading(text) { line("", 9, false, 9); line(text.toUpperCase(), 10, true, 17); }
line(profile.name, 25, true, 30);
line(profile.role, 11, false, 18);
line(`${profile.email} | ${profile.github}`, 9, false, 16);
heading("Professional summary"); wrap(profile.summary);
heading("Support & service delivery");
wrap(`${profile.yearsExperience} years in IT | ${profile.metrics.map(m => `${m.value} ${m.label.toLowerCase()}`).join(" | ")}`);
heading("Selected projects");
for (const project of profile.projects) { line(project.title, 10, true, 15); wrap(project.description); line("", 9, false, 7); }
heading("Skills & platforms"); wrap(profile.skills.join(" | "));
if (profile.workHistory.length) { heading("Work history"); for (const role of profile.workHistory) { line(`${role.title} | ${role.company} | ${role.dates}`, 10, true, 15); for (const point of role.highlights) wrap("- " + point); } }
if (profile.certifications.length) { heading("Certifications"); for (const cert of profile.certifications) wrap(`${cert.name} | ${cert.issuer} | ${cert.date}`); }
// Fail instead of silently dropping content or producing a clipped resume.
const height = rows.reduce((sum, row) => sum + row.gap, 0);
if (height > 696) throw new Error("Resume exceeds one page. Shorten the summary/project descriptions or supply a curated one-page PDF.");
let y = 750;
const stream = rows.map(row => { const op = `BT /${row.bold ? "F2" : "F1"} ${row.size} Tf 0.09 0.13 0.16 rg 46 ${y} Td (${escape(row.text)}) Tj ET`; y -= row.gap; return op; }).join("\n");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
];
let pdf = "%PDF-1.4\n"; const offsets = [0];
for (const [i, object] of objects.entries()) { offsets.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${object}\nendobj\n`; }
const start = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n` + offsets.slice(1).map(n => String(n).padStart(10, "0") + " 00000 n \n").join("");
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`;
await writeFile(new URL("../public/jose-jerez-resume.pdf", import.meta.url), pdf);
console.log(`Generated one-page resume (${height}pt of 696pt available).`);
