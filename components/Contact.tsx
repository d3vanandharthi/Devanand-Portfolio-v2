import React from 'react';
import { SectionId } from '../types';
import { Mail, Linkedin, Github, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id={SectionId.CONTACT} className="py-20 bg-black relative overflow-hidden">
       {/* Decorative gradient */}
       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent"></div>
       
       <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
         <h2 className="text-4xl font-bold text-white mb-8">Ready to Architect the Future?</h2>
         <p className="text-xl text-gray-400 mb-12">
           Available for opportunities in Enterprise .NET Development and Cloud Architecture.
         </p>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-lg bg-card-bg border border-white/5 flex flex-col items-center hover:border-neon-blue/40 transition-colors">
              <Mail className="text-neon-blue mb-4" size={32} />
              <h3 className="text-white font-bold mb-2">Email</h3>
              <a href="mailto:d3vanandharthi@gmail.com" className="text-gray-400 hover:text-white transition-colors text-sm">
                d3vanandharthi@gmail.com
              </a>
            </div>

            <div className="p-6 rounded-lg bg-card-bg border border-white/5 flex flex-col items-center hover:border-neon-blue/40 transition-colors">
              <Phone className="text-neon-blue mb-4" size={32} />
              <h3 className="text-white font-bold mb-2">Phone</h3>
              <span className="text-gray-400 text-sm">
                +91 9075401950
              </span>
            </div>

            <div className="p-6 rounded-lg bg-card-bg border border-white/5 flex flex-col items-center hover:border-neon-blue/40 transition-colors">
              <MapPin className="text-neon-blue mb-4" size={32} />
              <h3 className="text-white font-bold mb-2">Base</h3>
              <span className="text-gray-400 text-sm">
                Bangalore, India
              </span>
            </div>
         </div>

         <div className="flex justify-center gap-8">
           <a href="https://linkedin.com/in/devanandharthi" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-neon-blue transition-colors">
             <Linkedin size={28} />
           </a>
           <a href="https://github.com/d3vanandharthi" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-neon-blue transition-colors">
             <Github size={28} />
           </a>
         </div>

         <div className="mt-16 pt-8 border-t border-gray-900 text-gray-600 font-mono text-sm">
           <p>© {new Date().getFullYear()} Devanand Harthi. Built with React, Tailwind & Gemini AI.</p>
         </div>
       </div>
    </section>
  );
};

export default Contact;