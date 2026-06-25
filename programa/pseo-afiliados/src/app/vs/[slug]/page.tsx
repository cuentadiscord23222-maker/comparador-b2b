import { notFound } from 'next/navigation';
import toolsData from '@/data/tools.json';
import { Metadata } from 'next';
import Link from 'next/link';

type Tool = {
  slug: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  pricing: string;
  affiliateLink?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];
  
  // Agrupar por categoría
  const byCategory = toolsData.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof toolsData>);

  // Generar rutas solo para la misma categoría
  for (const category in byCategory) {
    const tools = byCategory[category];
    for (let i = 0; i < tools.length; i++) {
      for (let j = i + 1; j < tools.length; j++) {
        paths.push({ slug: `${tools[i].slug}-vs-${tools[j].slug}` });
      }
    }
  }
  
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const parts = slug.split('-vs-');
  
  if (parts.length !== 2) return { title: 'Comparison Not Found' };
  
  const tool1 = toolsData.find((t) => t.slug === parts[0]);
  const tool2 = toolsData.find((t) => t.slug === parts[1]);

  if (!tool1 || !tool2) return { title: 'Comparison Not Found' };

  return {
    title: `${tool1.name} vs ${tool2.name} - The Best Tool (2026)`,
    description: `Discover which is better between ${tool1.name} and ${tool2.name}. Comparison table, pricing, pros, and cons to choose the ideal tool.`,
  };
}

export default async function ComparisonPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const parts = slug.split('-vs-');

  if (parts.length !== 2) {
    notFound();
  }

  const [slug1, slug2] = parts;

  const tool1 = toolsData.find((t) => t.slug === slug1) as Tool | undefined;
  const tool2 = toolsData.find((t) => t.slug === slug2) as Tool | undefined;

  if (!tool1 || !tool2) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Navbar Mock */}
      <header className="sticky top-0 w-full z-50 px-6 py-4 border-b border-white/5 bg-[#0a0a0c]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 hover:opacity-80 transition-opacity">
            CompareB2B
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#0a0a0c] to-[#0a0a0c]"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -z-10 opacity-60 pointer-events-none mix-blend-screen animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full -z-10 opacity-60 pointer-events-none mix-blend-screen" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20 mb-8 bg-indigo-500/10 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            Definitive Analysis 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 flex flex-col md:flex-row justify-center items-center gap-4">
            <span className="text-white drop-shadow-lg">{tool1.name}</span>
            <span className="text-slate-500 font-light text-4xl md:text-6xl italic">vs</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-lg">{tool2.name}</span>
          </h1>
          
          <h2 className="mt-6 text-xl md:text-2xl leading-8 text-slate-300 max-w-3xl mx-auto font-light">
            Discover which is the best tool for your team. We compare features, pricing, pros, and cons so you can make the right decision.
          </h2>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 relative z-10">
        
        {/* Head-to-Head Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-24">
          <ToolDetailedCard tool={tool1} accent="blue" isWinner={true} />
          <ToolDetailedCard tool={tool2} accent="purple" isWinner={false} />
        </div>

        {/* Comparison Table Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Comparison Table</h3>
            <p className="text-slate-400">A quick glance at the key differences</p>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20">
                    <th className="p-6 text-lg font-medium text-slate-300 w-1/3">Feature</th>
                    <th className="p-6 text-xl font-bold text-white w-1/3 border-l border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                        {tool1.name}
                      </div>
                    </th>
                    <th className="p-6 text-xl font-bold text-white w-1/3 border-l border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                        {tool2.name}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 font-medium text-slate-200">Main Focus</td>
                    <td className="p-6 border-l border-white/5">{tool1.pros[0]}</td>
                    <td className="p-6 border-l border-white/5">{tool2.pros[0]}</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 font-medium text-slate-200">Learning Curve</td>
                    <td className="p-6 border-l border-white/5">{tool1.cons[0].includes('learning') || tool1.cons[0].includes('aprendizaje') || tool1.cons[0].toLowerCase().includes('steep') ? 'High' : 'Low / Moderate'}</td>
                    <td className="p-6 border-l border-white/5">{tool2.cons[0].includes('learning') || tool2.cons[0].includes('aprendizaje') || tool2.cons[0].toLowerCase().includes('steep') ? 'High' : 'Low / Moderate'}</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 font-medium text-slate-200">Pricing Model</td>
                    <td className="p-6 border-l border-white/5">{tool1.pricing}</td>
                    <td className="p-6 border-l border-white/5">{tool2.pricing}</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors bg-black/10">
                    <td className="p-6 font-medium text-slate-200">Verdict</td>
                    <td className="p-6 border-l border-white/5">
                      <div className="inline-flex items-center px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-sm font-medium ring-1 ring-inset ring-emerald-500/20">
                        Excellent for {tool1.name.toLowerCase()}
                      </div>
                    </td>
                    <td className="p-6 border-l border-white/5">
                      <div className="inline-flex items-center px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-sm font-medium ring-1 ring-inset ring-blue-500/20">
                        Ideal for professionals
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA Section with micro-animations */}
        <div className="mt-16 text-center rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-white/10 p-12 md:p-20 max-w-5xl mx-auto shadow-2xl relative overflow-hidden group">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Ready to start?
            </h2>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
              Take advantage of our exclusive offers and start using the tool that will transform the way you work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href={tool1.affiliateLink || "#"} target="_blank" rel="noopener noreferrer" className="relative group/btn w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-70 group-hover/btn:opacity-100 transition duration-300 group-hover/btn:duration-200 animate-tilt"></div>
                <button className="relative w-full sm:w-auto px-8 py-5 rounded-2xl bg-black leading-none flex items-center justify-center gap-3 transition-all duration-300 group-hover/btn:scale-[1.02]">
                  <span className="text-white font-bold text-lg">Try {tool1.name} for Free</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-indigo-400 group-hover/btn:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </a>

              <span className="text-slate-500 font-medium italic text-sm">or also</span>

              <a href={tool2.affiliateLink || "#"} target="_blank" rel="noopener noreferrer" className="relative group/btn2 w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50 group-hover/btn2:opacity-100 transition duration-300 group-hover/btn2:duration-200 animate-tilt"></div>
                <button className="relative w-full sm:w-auto px-8 py-5 rounded-2xl bg-slate-900 border border-white/10 leading-none flex items-center justify-center gap-3 transition-all duration-300 group-hover/btn2:scale-[1.02] group-hover/btn2:bg-black">
                  <span className="text-slate-200 font-semibold text-lg">Try {tool2.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-purple-400 group-hover/btn2:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolDetailedCard({ tool, accent, isWinner }: { tool: Tool, accent: 'blue' | 'purple', isWinner: boolean }) {
  const gradientClass = accent === 'blue' ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-pink-600';
  const shadowClass = accent === 'blue' ? 'group-hover:shadow-[0_10px_40px_-15px_rgba(59,130,246,0.5)]' : 'group-hover:shadow-[0_10px_40px_-15px_rgba(168,85,247,0.5)]';
  const badgeClass = accent === 'blue' ? 'bg-blue-500/20 text-blue-300 ring-blue-500/30' : 'bg-purple-500/20 text-purple-300 ring-purple-500/30';

  return (
    <div className={`flex flex-col bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 relative group ${shadowClass}`}>
      {/* Top Accent Line */}
      <div className={`h-2 w-full bg-gradient-to-r ${gradientClass}`}></div>
      
      {/* Card Header */}
      <div className="p-8 pb-0 relative z-10">
        {isWinner && (
          <div className="absolute top-6 right-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
              </svg>
              Popular
            </div>
          </div>
        )}
        <h2 className="text-4xl font-black mb-4 tracking-tight">{tool.name}</h2>
        <p className="text-slate-400 text-lg leading-relaxed h-20 overflow-hidden">
          {tool.description}
        </p>
      </div>

      <div className="p-8 flex-1 flex flex-col relative z-10">
        <div className="space-y-8 flex-1">
          {/* Pros Section */}
          <div className="bg-emerald-500/5 rounded-2xl p-6 border border-emerald-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-emerald-500">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-4 text-emerald-400">
              <span className="flex h-5 w-5 rounded-full bg-emerald-500/20 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              Pros
            </h3>
            <ul className="space-y-4">
              {tool.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300 font-medium">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons Section */}
          <div className="bg-rose-500/5 rounded-2xl p-6 border border-rose-500/10">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-4 text-rose-400">
              <span className="flex h-5 w-5 rounded-full bg-rose-500/20 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              Cons
            </h3>
            <ul className="space-y-4">
              {tool.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-400">
                  <div className="mt-1.5 w-1 h-1 rounded-full bg-rose-500/50 flex-shrink-0"></div>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing Badge */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold ring-1 ring-inset ${badgeClass} backdrop-blur-sm`}>
            {tool.pricing}
          </div>
        </div>
      </div>
    </div>
  );
}
