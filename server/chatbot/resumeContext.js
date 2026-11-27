import { readFileSync } from 'node:fs';
import { writeFile, mkdir } from 'node:fs/promises';

const generated = new URL('./generated-resume.json', import.meta.url);

export function publicResume(content) {
  const { personalInfo: person, skills, experiences, projects, extensions, education, stats } = content;
  return {
    name: person.name, title: person.designation, summary: person.bio,
    focus: person.currentFocus, location: person.location,
    skills,
    experiences: experiences.map(({ role, company, companyDetail, duration, type, highlights }) =>
      ({ role, company, ...(companyDetail ? { companyDetail } : {}), duration, type, highlights })),
    projects: projects.map(({ title, category, stack, description, highlights }) => ({ title, category, stack, description, highlights })),
    extensions: extensions.map(({ title, description, metric, label }) => ({ title, description, metric, label })),
    education, stats,
    links: { linkedin: person.linkedin, github: person.github, resume: '/resume.pdf' },
  };
}

export async function writeResumeContext(content) {
  await mkdir(new URL('.', generated), { recursive: true });
  await writeFile(generated, JSON.stringify(publicResume(content), null, 2) + '\n');
}

// Generated from the existing Vite SSR exports, never manually maintained.
// Read per request so the full local workflow also sees saved resume updates.
export function getResumeContext() {
  return JSON.parse(readFileSync(generated, 'utf8'));
}
