import React, { useRef, useState } from 'react';
import { SectionId } from '../types';
import { PROJECTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';

const Projects: React.FC = () => {
  return (
    <section id={SectionId.PROJECTS} className="py-32 bg-dark-bg relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-20 border-b border-gray-800 pb-8">
           <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter">WORK</h2>
           <span className="hidden md:block font-mono text-gray-500 mb-4">SELECTED CASES (0{PROJECTS.length})</span>
        </div>

        <div className="grid grid-cols-1 gap-16">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard: React.FC<{ project: any; index: number }> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;

    setTransform(`rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('rotateY(0deg) rotateX(0deg) scale(1)');
  };

  return (
    <div 
      className="perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        className="group relative bg-card-bg rounded-3xl overflow-hidden border border-white/5 transition-all duration-200 ease-out shadow-2xl"
        style={{ transform, transformStyle: 'preserve-3d' }}
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Visual Side */}
          <div className={`h-80 md:h-auto min-h-[400px] relative overflow-hidden bg-gradient-to-br ${
              index % 2 === 0 ? 'from-purple-900/40 to-black' : 'from-cyan-900/40 to-black'
          }`}>
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             
             {/* Floating Elements */}
             <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                <span className="text-[12rem] font-bold text-white/5 group-hover:text-white/10 select-none transform translate-z-10 transition-transform duration-500 group-hover:scale-110">
                  0{index + 1}
                </span>
             </div>
             
             {/* Overlay Gradient on Hover */}
             <div className="absolute inset-0 bg-neon-blue/0 group-hover:bg-neon-blue/5 transition-colors duration-500"></div>
          </div>

          {/* Content Side */}
          <div className="p-8 md:p-16 flex flex-col justify-center relative bg-card-bg">
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent"></div>

            <div className="flex items-center gap-3 mb-6 transform translate-z-10">
              <span className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-gray-400 uppercase tracking-widest group-hover:border-white/30 transition-colors">
                {project.category}
              </span>
              {project.stats && (
                <span className="text-neon-blue text-xs font-mono">
                  // {project.stats}
                </span>
              )}
            </div>

            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 group-hover:text-neon-blue transition-colors transform translate-z-20">
              {project.title}
            </h3>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md transform translate-z-10">
              {project.description}
            </p>

            <div className="flex items-center gap-6 transform translate-z-10">
              <button className="flex items-center gap-2 text-white border-b border-white/30 pb-1 hover:border-white transition-all group/btn">
                <span className="font-mono text-sm">VIEW CASE</span>
                <ArrowUpRight size={16} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;