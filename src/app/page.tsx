const projects = [
  {
    title: "Asset Recovery Automation Platform",
    tag: "ServiceNow • Workday • FedEx • Asset Management",
    description:
      "Designed and implemented an automated asset recovery workflow that generates return labels, tracks equipment status, automates follow-up communications, and improves asset visibility.",
  },
  {
    title: "Verification Management Workflow",
    tag: "ServiceNow • Email Processing • Reporting",
    description:
      "Built a verification workflow with automated intake, applicant tracking, flagged record detection, duplicate prevention, notifications, and dashboard reporting.",
  },
  {
    title: "SLA Response Automation",
    tag: "Workflow Automation • Slack • SLA Management",
    description:
      "Developed automated reminder and escalation workflows that reduced average first-response times from approximately 18–19 minutes to 5–8 minutes.",
  },
  {
    title: "Distribution List Request Portal",
    tag: "Service Catalog • Google Workspace",
    description:
      "Created a structured request workflow replacing manual Slack requests and improving fulfillment efficiency.",
  },
];

const skills = [
  "Workflow Automation",
  "IT Operations",
  "Systems Administration",
  "SaaS Administration",
  "Identity Management",
  "ServiceNow",
  "Okta",
  "SSO",
  "SAML",
  "MFA",
  "Google Workspace",
  "Microsoft 365",
  "Workday",
  "Kandji",
  "Genesys Cloud",
  "Meraki",
  "Cloudflare VPN",
  "REST APIs",
  "Asset Management",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070A13] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070A13]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="text-lg font-bold">Jose Jerez</div>

          <div className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#projects" className="hover:text-cyan-300">Projects</a>
            <a href="#skills" className="hover:text-cyan-300">Skills</a>
            <a href="#about" className="hover:text-cyan-300">About</a>
            <a href="#ask" className="hover:text-cyan-300">Ask Jose</a>
            <a href="#contact" className="hover:text-cyan-300">Contact</a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
          IT Operations • ServiceNow Administration • Automation improvement
        </p>

        <h1 className="max-w-5xl text-5xl font-black tracking-tight md:text-7xl">
          Simplifying operations through automation and design
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-8 text-slate-300">
          IT Operations professional specializing in workflow automation,
          identity management, SaaS administration, and enterprise systems.
          Experienced supporting a workforce of 3,500–5,000 employees while
          designing automations, integrations, and operational workflows that
          improve efficiency, visibility, and service delivery.
        </p>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
          Platforms include ServiceNow, Okta, Google Workspace, Workday,
          Microsoft 365, Kandji, Genesys Cloud, and Meraki.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
          >
            View Projects
          </a>

          <a
            href="#contact"
            className="rounded-xl border border-white/15 px-6 py-3 font-bold hover:bg-white/10"
          >
            Contact Me
          </a>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl px-6 pb-24">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Featured Work
        </p>

        <h2 className="mt-4 text-4xl font-black">Automation Projects</h2>

        <p className="mt-4 max-w-3xl text-slate-300">
          Practical IT operations projects built to reduce manual work, improve
          visibility, and support business teams.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-cyan-300/50"
            >
              <p className="text-sm font-semibold text-cyan-300">
                {project.tag}
              </p>

              <h3 className="mt-3 text-2xl font-bold">{project.title}</h3>

              <p className="mt-4 leading-7 text-slate-300">
                {project.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="mx-auto max-w-6xl px-6 pb-24">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Technologies
        </p>

        <h2 className="mt-4 text-4xl font-black">Skills & Platforms</h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-4xl font-black">About Me</h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Outside of technology, I enjoy baseball, football, hiking, camping,
            cooking, and finding places good places to with my family. 
          </p>
        </div>
      </section>

      <section id="ask" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Coming Soon
          </p>

          <h2 className="mt-4 text-4xl font-black">Ask Jose</h2>

          <p className="mt-4 max-w-3xl text-slate-300">
            A recruiter-focused AI chatbot that will answer questions about my
            resume, automation projects, technical background, and work history.
          </p>
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-6xl px-6 pb-24">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Experience Snapshot
        </p>

        <h2 className="mt-4 text-4xl font-black">By The Numbers</h2>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-4xl font-black text-cyan-300">5,600+</p>
            <p className="mt-2 text-slate-300">Tickets Resolved</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-4xl font-black text-cyan-300">&lt;15 min</p>
            <p className="mt-2 text-slate-300">Response Time</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-4xl font-black text-cyan-300">3,500–5,000</p>
            <p className="mt-2 text-slate-300">Employees Supported</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-4xl font-black text-cyan-300">4+</p>
            <p className="mt-2 text-slate-300">Years in IT</p>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-4xl font-black">Let's Connect</h2>

          <p className="mt-4 max-w-3xl text-slate-300">
            Open to IT Operations, Systems Administration, Enterprise
            Applications, IAM, SaaS Administration, and ServiceNow opportunities.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="mailto:josejerez310@yahoo.com"
              className="rounded-xl bg-white px-6 py-3 font-bold text-slate-950 hover:bg-slate-200"
            >
              Email Me
            </a>

            <a
              href="https://github.com/josejerez27"
              className="rounded-xl border border-white/15 px-6 py-3 font-bold hover:bg-white/10"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}