import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Contact from './components/sections/Contact';
import CredibilityStrip from './components/sections/CredibilityStrip';
import Education from './components/sections/Education';
import PortfolioChatbot from './components/chatbot/PortfolioChatbot';

export default function App() {
  return (
    <ThemeProvider>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <CredibilityStrip />
        <Projects />
        <Experience />
        <About />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <PortfolioChatbot />
    </ThemeProvider>
  );
}



