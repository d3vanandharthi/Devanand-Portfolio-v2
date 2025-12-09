import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SectionId } from '../types';
import { SKILL_DATA } from '../constants';
import { RefreshCcw, Cpu } from 'lucide-react';

const Skills: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const initSimulation = () => {
    if (!svgRef.current || !containerRef.current) return;

    // Wait for layout to be stable
    if (containerRef.current.clientWidth === 0) return;

    const width = containerRef.current.clientWidth;
    const height = 600;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    // Force Simulation
    const simulation = d3.forceSimulation(SKILL_DATA as unknown as d3.SimulationNodeDatum[])
      .force("charge", d3.forceManyBody().strength(-20)) // Repel slightly
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.radius + 10).strength(0.8))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force("x", d3.forceX(width / 2).strength(0.05));

    // Links: Create artificial links for visual structure (optional, connecting similar groups)
    // For now, let's keep them as floating nodes but add a "constellation" effect background

    const node = svg.append("g")
      .selectAll("g")
      .data(SKILL_DATA)
      .join("g")
      .attr("cursor", "none") // Custom cursor handles it
      .call((d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)) as any);

    // Glow Effect
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Circles
    node.append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", "#0a0a0a") // Dark center
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .style("filter", "url(#glow)")
      .transition().duration(1000)
      .attr("r", (d) => d.radius);

    // Text Label
    node.append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .style("font-size", "12px")
      .style("font-family", "'ui-monospace', monospace")
      .style("pointer-events", "none")
      .style("text-shadow", "0 0 5px rgba(0,0,0,0.8)");

    // Hover interactions
    node.on("mouseover", function (event, d) {
      d3.select(this).select("circle")
        .transition().duration(200)
        .attr("fill", d.color)
        .attr("stroke", "#fff")
        .attr("r", d.radius * 1.1);

      d3.select(this).select("text")
        .style("font-weight", "bold")
        .style("font-size", "14px");

      setActiveSkill(d.id);
    })
      .on("mouseout", function (event, d) {
        d3.select(this).select("circle")
          .transition().duration(500)
          .attr("fill", "#0a0a0a")
          .attr("stroke", d.color)
          .attr("r", d.radius);

        d3.select(this).select("text")
          .style("font-weight", "normal")
          .style("font-size", "12px");

        setActiveSkill(null);
      });

    simulation.on("tick", () => {
      node.attr("transform", d => `translate(${(d as any).x},${(d as any).y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => simulation.stop();
  };

  useEffect(() => {
    // Delay init slightly to ensure container has size
    const timer = setTimeout(() => {
      initSimulation();
    }, 500);

    window.addEventListener('resize', initSimulation);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initSimulation);
    };
  }, []);

  return (
    <section id={SectionId.SKILLS} className="py-24 relative bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-6 border-b border-gray-800">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Technical Matrix</h2>
            <p className="text-gray-400 font-mono text-sm max-w-xl mt-4">
              A comprehensive view of my technological arsenal. Interactive force-directed graph.
            </p>
          </div>
          <button
            onClick={initSimulation}
            className="mt-4 md:mt-0 p-3 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/10 transition-all rounded-full"
            title="Reset Simulation"
          >
            <RefreshCcw size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 relative h-[600px] bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl" ref={containerRef}>
            <div className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 font-mono text-xs z-10">
              <Cpu size={14} />
              <span>SIMULATION_ACTIVE</span>
            </div>
            <svg ref={svgRef} className="w-full h-full"></svg>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card-bg p-8 rounded-3xl border border-white/5 hover:border-neon-purple/50 transition-colors group">
              <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-neon-purple transition-colors">Core Stack</h3>
              <div className="flex flex-wrap gap-2">
                {['.NET Core', 'C#', 'ASP.NET MVC', 'Razor Pages'].map(s => (
                  <span key={s} className="px-3 py-1 bg-white/5 text-gray-300 text-sm rounded-full font-mono border border-white/10">{s}</span>
                ))}
              </div>
            </div>

            <div className="bg-card-bg p-8 rounded-3xl border border-white/5 hover:border-neon-blue/50 transition-colors group">
              <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-neon-blue transition-colors">Data & Cloud</h3>
              <div className="flex flex-wrap gap-2">
                {['Snowflake', 'SQL Server', 'MongoDB', 'Azure', 'Docker'].map(s => (
                  <span key={s} className="px-3 py-1 bg-white/5 text-gray-300 text-sm rounded-full font-mono border border-white/10">{s}</span>
                ))}
              </div>
            </div>

            <div className="bg-card-bg p-8 rounded-3xl border border-white/5 hover:border-amber-500/50 transition-colors group">
              <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-amber-500 transition-colors">Architecture</h3>
              <div className="flex flex-wrap gap-2">
                {['Clean Architecture', 'Microservices', 'GenAI', 'SOLID'].map(s => (
                  <span key={s} className="px-3 py-1 bg-white/5 text-gray-300 text-sm rounded-full font-mono border border-white/10">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;