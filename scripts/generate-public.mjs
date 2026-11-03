import { writeFile, copyFile } from 'node:fs/promises';

const bullets = items => items.map(item => `- ${item}`).join('\n');
export async function generatePublic(content, canonical) {
  const { personalInfo: person, skills, experiences, projects, extensions, education, stats, siteCopy: copy, skillGroups } = content;
  const profile = {
    schemaVersion: 1,
    name: person.name, title: person.designation, location: person.location,
    tagline: person.tagline, summary: person.bio, currentFocus: person.currentFocus,
    hero: copy.hero,
    skills: skillGroups.map(group => ({ category: group.label, technologies: skills[group.key] })),
    experience: experiences, projects, additionalProjects: extensions, education, stats,
    contact: { email: person.email, phone: person.phone },
    professionalLinks: { website: canonical, linkedin: person.linkedin, github: person.github, resume: new URL('resume.pdf', canonical).href },
    notes: [copy.figuresDisclaimer, copy.work.disclaimer, copy.extensions.disclaimer],
    sectionCopy: copy,
  };
  await writeFile('dist/profile.json', JSON.stringify(profile, null, 2) + '\n');
  const markdown = [
    `# ${person.name}`, `## Professional Summary`, person.designation, person.location,
    person.tagline, ...Object.values(copy.hero).filter(value => value !== copy.hero.aboutLink), person.bio, person.currentFocus,
    ...stats.map(stat => `${stat.value}${stat.suffix} — ${stat.label}`), copy.figuresDisclaimer,
    '## Technical Skills', copy.skills.title, copy.skills.introduction,
    ...skillGroups.flatMap(group => [`### ${group.label}`, bullets(skills[group.key])]),
    '## Professional Experience', copy.experience.title, copy.experience.introduction,
    ...experiences.flatMap(item => [`### ${item.role}`, item.company, ...(item.companyDetail ? [item.companyDetail] : []), item.duration, item.type, bullets(item.highlights)]),
    '## Projects', copy.work.title, copy.work.introduction,
    ...projects.flatMap(item => [`### ${item.title}`, item.category, item.description, bullets(item.stack), 'What I worked on', bullets(item.highlights)]), copy.work.disclaimer,
    '## Additional Projects', copy.extensions.title,
    ...extensions.flatMap(item => [`### ${item.title}`, item.description, `${item.metric} ${item.label}`]), copy.extensions.disclaimer,
    '## Education', ...education.flatMap(item => [`### ${item.degree}`, item.institution, item.score]),
    '## Contact', copy.contact.title, copy.contact.description,
    `[${person.email}](mailto:${person.email})`, `[${person.phone}](tel:${person.phone.replaceAll(' ', '')})`,
    `[LinkedIn](${person.linkedin})`, `[GitHub](${person.github})`, `[Resume](${profile.professionalLinks.resume})`,
  ].join('\n\n') + '\n';
  await writeFile('dist/profile.md', markdown);
  await writeFile('dist/llms.txt', `# ${person.name}\n\n> ${person.designation} — ${person.location}\n\n${person.bio}\n\n- [Portfolio](${canonical})\n- [Full profile in Markdown](${canonical}profile.md)\n- [Structured profile](${canonical}profile.json)\n- [Resume](${profile.professionalLinks.resume})\n`);
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${canonical}</loc></url>\n</urlset>\n`);
  await copyFile('src/data/Rohit_N_Hiremath_Frontend_developer.pdf', 'dist/resume.pdf');
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'Person', '@id': `${canonical}#person`,
    name: person.name, jobTitle: person.designation, description: person.bio,
    url: canonical, email: person.email, telephone: person.phone,
    homeLocation: { '@type': 'Place', name: person.location },
    sameAs: [person.linkedin, person.github],
    knowsAbout: [...new Set(Object.values(skills).flat())],
  };
  return { profile, structuredData };
}
