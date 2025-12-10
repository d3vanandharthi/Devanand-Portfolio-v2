import React, { useEffect, useRef } from 'react';
import { SectionId } from '../types';
import { EXPERIENCES } from '../constants';
import { ArrowRight } from 'lucide-react';

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-20');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = sectionRef.current?.querySelectorAll('.experience-item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id={SectionId.EXPERIENCE} ref={sectionRef} className="py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 flex items-end justify-between border-b border-white/10 pb-8">
          <h2 className="text-4xl md:text-8xl font-bold text-white tracking-tighter">
            EXP.
          </h2>
          <div className="hidden md:block font-mono text-gray-500 mb-2">
            // CAREER TIMELINE
          </div>
        </div>

        <div className="relative border-l border-white/10 ml-3 md:ml-0 md:pl-0 space-y-24">
          {EXPERIENCES.map((exp, index) => (
            <div
              key={exp.id}
              className="experience-item relative pl-8 md:pl-0 opacity-0 translate-y-20 transition-all duration-1000 ease-out"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-12 gap-12 items-start group">
                {/* Year */}
                <div className="col-span-3 text-right pt-2 sticky top-32">
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-800 group-hover:from-white group-hover:to-gray-500 transition-all duration-500 block mb-2">
                    {exp.period.split(' ')[0]}
                  </span>
                  <span className="text-sm font-mono text-neon-blue tracking-wider">{exp.period}</span>
                </div>

                {/* Dot */}
                <div className="absolute left-0 md:left-[25%] -translate-x-1/2 w-3 h-3 bg-black border border-gray-600 rotate-45 mt-5 group-hover:border-neon-blue group-hover:bg-neon-blue group-hover:scale-150 transition-all duration-500 z-10"></div>

                {/* Content */}
                <div className="col-span-9 pl-12 border-l border-white/5 md:border-none">
                  <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors duration-300">{exp.role}</h3>
                  <div className="text-xl text-gray-400 mb-8 flex items-center gap-2 font-mono">
                    {exp.company} <span className="text-gray-600">/</span> {exp.location}
                  </div>

                  <div className="bg-white/5 p-8 rounded-tr-3xl rounded-bl-3xl border border-white/5 hover:border-white/20 transition-all duration-500 group-hover:bg-white/[0.07]">
                    <ul className="space-y-4 mb-8">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-gray-300 flex items-start gap-4 text-lg font-light leading-relaxed">
                          <span className="mt-2.5 w-1 h-1 bg-neon-purple flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                      {exp.tech.map((t, i) => (
                        <span
                          key={t}
                          className="px-4 py-1.5 bg-black border border-white/10 text-xs text-gray-400 font-mono hover:text-white hover:border-neon-blue/50 transition-colors cursor-default"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="absolute left-0 top-2 -translate-x-[5px] w-2.5 h-2.5 bg-neon-blue rotate-45"></div>
                <div className="text-neon-blue font-mono text-xs mb-2 tracking-widest uppercase">{exp.period}</div>
                <h3 className="text-3xl font-bold text-white mb-1 leading-tight">{exp.role}</h3>
                <div className="text-lg text-gray-500 mb-6 font-mono border-b border-white/10 pb-4 inline-block">{exp.company}</div>
                <ul className="space-y-4 text-gray-300">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed font-light">
                      <ArrowRight size={16} className="text-neon-blue flex-shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;