import Link from "next/link";
import toolsData from '@/data/tools.json';

export default function Home() {
  // Group tools by category
  const categoriesMap = toolsData.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof toolsData>);

  const categorizedComparisons = Object.entries(categoriesMap).map(([category, tools]) => {
    const pairs = [];
    for (let i = 0; i < tools.length; i++) {
      for (let j = i + 1; j < tools.length; j++) {
        pairs.push({ t1: tools[i], t2: tools[j] });
      }
    }
    return { category, pairs: pairs.slice(0, 3) }; // limit to 3 pairs per category to keep UI clean
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">
      
      {/* Navbar Mock */}
      <header className="absolute top-0 w-full z-50 px-6 py-6 border-b border-white/5 bg-slate-950/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            CompareB2B
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#comparisons" className="hover:text-white transition-colors">Tools</a>
            <a href="#comparisons" className="hover:text-white transition-colors">Categories</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 -z-10 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 blur-[128px] rounded-full -z-10 pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 blur-[128px] rounded-full -z-10 pointer-events-none mix-blend-screen"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center z-10 flex flex-col items-center">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/20 mb-8 bg-indigo-500/10 backdrop-blur-sm shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
            The leading comparison platform
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
            <span className="block text-white mb-2 drop-shadow-sm">Find the best</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-md">
              B2B tool
            </span>
          </h1>
          
          <p className="mt-4 text-lg md:text-xl leading-8 text-slate-400 max-w-2xl mx-auto font-light mb-12">
            Don't waste time trying every software. Compare features, pricing, and reviews in seconds with our ultimate guides.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            <a href="#comparisons" className="w-full">
              <button className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95 w-full">
                Explore comparisons
              </button>
            </a>
            <a href="#comparisons" className="w-full">
              <button className="px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md border border-white/10 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] active:scale-95 w-full">
                View categories
              </button>
            </a>
          </div>
        </div>
      </main>

      {/* Comparisons Section */}
      <section id="comparisons" className="py-24 relative z-10 border-t border-white/5 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">Epic Battles by Category</h2>
            <p className="text-slate-400">Discover who wins in our head-to-head analysis within each software category.</p>
          </div>
          
          <div className="space-y-20">
            {categorizedComparisons.map(({ category, pairs }) => (
              <div key={category} className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-2xl font-bold text-white">{category}</h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {pairs.map(({ t1, t2 }, idx) => (
                    <Link key={idx} href={`/vs/${t1.slug}-vs-${t2.slug}`}>
                      <div className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-indigo-500/50 hover:to-purple-500/50 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10"></div>
                        <div className="h-full bg-slate-900/90 backdrop-blur-xl rounded-[23px] p-8 flex flex-col items-center text-center border border-white/5 overflow-hidden relative">
                          <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          
                          <div className="flex items-center justify-center gap-4 w-full mb-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-500 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                              {t1.name[0]}
                            </div>
                            <span className="text-slate-500 font-medium italic">vs</span>
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-500 group-hover:border-purple-500/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                              {t2.name[0]}
                            </div>
                          </div>
                          
                          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                            {t1.name} vs {t2.name}
                          </h4>
                          <p className="text-sm text-slate-400 flex-1">
                            Which is the best option for your needs?
                          </p>
                          
                          <div className="mt-6 w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-400 group-hover:text-indigo-300">
                            View comparison
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Mock */}
      <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm">
        <p>© 2026 CompareB2B. All rights reserved.</p>
      </footer>
    </div>
  );
}
