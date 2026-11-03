import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { personalInfo, skills, experiences, projects, extensions, education, stats } from './data/resumeData';
import { siteCopy, skillGroups } from './data/siteCopy';

export const portfolioContent = { personalInfo, skills, experiences, projects, extensions, education, stats, siteCopy, skillGroups };

export function render() {
  return renderToString(<StrictMode><App /></StrictMode>);
}
