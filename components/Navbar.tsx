
import React, { useState, useEffect } from 'react';
import { SectionId } from '../types';
import { Menu, X, Terminal } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: SectionId) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navLinks = [
    { id: SectionId.HERO, label: '// HOME' },
    // About link removed
    { id: SectionId.SKILLS, label: '// SKILLS' },
    { id: SectionId.EXPERIENCE, label: '// EXP' },
    { id: SectionId.PROJECTS, label: '// WORK' },
    { id: SectionId.CONTACT, label: '// CONTACT' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark-bg/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => scrollToSection(SectionId.HERO)}>
            <Terminal className="h-8 w-8 text-neon-blue mr-2" />
            <span className="font-mono text-xl font-bold tracking-tighter text-white">
              DEVANAND<span className="text-neon-blue">.NET</span>
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="font-mono text-sm text-gray-300 hover:text-neon-blue transition-colors duration-200 px-3 py-2 rounded-md"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card-bg border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-gray-300 hover:text-neon-blue block px-3 py-2 rounded-md text-base font-medium font-mono w-full text-left"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
