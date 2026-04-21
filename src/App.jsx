import { Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';

// Code splitting with React.lazy — loads sections only when needed
// Concept: dynamic imports + Suspense for better initial load performance
const About = lazy(() => import('./components/sections/About'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Skills = lazy(() => import('./components/sections/Skills'));
const ReactConcepts = lazy(() => import('./components/sections/ReactConcepts'));
const Education = lazy(() => import('./components/sections/Education'));
const Contact = lazy(() => import('./components/sections/Contact'));

// Fallback while lazy sections load
function SectionFallback() {
  return (
    <div style={{
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="loading-spinner" />
    </div>
  );
}

export default function App() {
  return (
    // ThemeProvider wraps entire app — Context API pattern
    <ThemeProvider>
      <div className="app">
        {/* Ambient background blobs — fixed, decorative */}
        <div className="ambient-blob" style={{
          width: '700px', height: '700px',
          background: 'var(--accent-green)',
          top: '-300px', left: '-300px',
        }} />
        <div className="ambient-blob" style={{
          width: '500px', height: '500px',
          background: 'var(--accent-blue)',
          bottom: '10%', right: '-200px',
        }} />

        <Navbar />

        <main>
          {/* Hero loads eagerly (above fold) */}
          <Hero />

          {/* All other sections load lazily */}
          <Suspense fallback={<SectionFallback />}>
            <About />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <Experience />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <Projects />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <Skills />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <ReactConcepts />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <Education />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
