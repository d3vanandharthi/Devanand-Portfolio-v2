
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AIChat from './components/AIChat';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Marquee from './components/Marquee';
import GestureController from './components/GestureController';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-neon-blue selection:text-black overflow-x-hidden relative">
      <CustomCursor />
      <GestureController />
      
      <Preloader onLoadingComplete={() => setLoading(false)} />
      
      <div className={`transition-opacity duration-1000 delay-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
        <main>
          <Hero />
          
          <div className="border-t border-b border-white/5 bg-black">
            <Marquee text="FULL STACK ARCHITECT" />
          </div>

          <Skills />
          <Experience />
          
          <div className="py-20 bg-black">
             <Marquee text="FEATURED PROJECTS" reverse />
          </div>

          <Projects />
          
          <div className="pt-20 bg-black">
            <Marquee text="LET'S BUILD THE FUTURE" />
          </div>

          <Contact />
        </main>
        <AIChat />
      </div>
    </div>
  );
};

export default App;
