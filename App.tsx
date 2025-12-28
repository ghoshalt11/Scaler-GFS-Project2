
import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Hotel, 
  Search, 
  Target, 
  ChevronRight, 
  LayoutDashboard, 
  Settings, 
  HelpCircle,
  ExternalLink,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { HotelContext, MarketAnalysis, ProfitProjection } from './types';
import { geminiService } from './services/geminiService';
import { MetricCard } from './components/MetricCard';
import { RecommendationCard } from './components/RecommendationCard';

const App: React.FC = () => {
  const [context, setContext] = useState<HotelContext>({
    targetProfitability: 15,
    timeframe: 18,
    city: 'London',
    currentRevPAR: 145,
    currentADR: 180,
    currentOccupancy: 82
  });

  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await geminiService.generateActionPlan(context);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch market analysis');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAnalysis();
  }, []);

  const projections: ProfitProjection[] = useMemo(() => {
    const data: ProfitProjection[] = [];
    const baseProfit = 100000;
    const monthlyGrowth = (context.targetProfitability / 100) / context.timeframe;
    
    for (let i = 0; i <= context.timeframe; i++) {
      data.push({
        month: `M${i}`,
        projected: Math.round(baseProfit * (1 + (monthlyGrowth * i))),
        actual: i <= 3 ? Math.round(baseProfit * (1 + (monthlyGrowth * i * 0.95))) : undefined
      });
    }
    return data;
  }, [context]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-6 flex flex-col sticky top-0 md:h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Hotel className="text-white" size={20} />
          </div>
          <h1 className="font-bold text-white tracking-tight text-xl">Lumina AI</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl transition-all">
            <LayoutDashboard size={18} />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-all">
            <Target size={18} />
            <span className="font-medium">Strategic Goals</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-all">
            <TrendingUp size={18} />
            <span className="font-medium">Revenue Hub</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-all">
            <Settings size={18} />
            <span className="font-medium">Settings</span>
          </a>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white cursor-pointer transition-all">
            <HelpCircle size={18} />
            <span className="font-medium text-sm">Support Center</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Market Intelligence</h2>
            <p className="text-slate-500 font-medium">Strategic Roadmap for {context.city} Properties</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
              <span className="text-sm font-semibold text-slate-700">Target: {context.targetProfitability}% Profit Increase</span>
              <div className="w-px h-6 bg-slate-200" />
              <span className="text-sm font-semibold text-slate-700">{context.timeframe} Months</span>
            </div>
          </div>
        </header>

        {/* Inputs / Config Section */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property City</label>
              <input 
                type="text" 
                value={context.city} 
                onChange={(e) => setContext({...context, city: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profit Goal (X%)</label>
              <input 
                type="number" 
                value={context.targetProfitability} 
                onChange={(e) => setContext({...context, targetProfitability: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeframe (Y Months)</label>
              <input 
                type="number" 
                value={context.timeframe} 
                onChange={(e) => setContext({...context, timeframe: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={fetchAnalysis}
                disabled={isLoading}
                className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                Refresh Analysis
              </button>
            </div>
          </div>
        </section>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard 
            label="Current RevPAR" 
            value={`$${context.currentRevPAR}`} 
            trend={3.2} 
            icon={<DollarSign size={20} />} 
          />
          <MetricCard 
            label="Average Daily Rate" 
            value={`$${context.currentADR}`} 
            trend={1.8} 
            icon={<TrendingUp size={20} />} 
          />
          <MetricCard 
            label="Occupancy Rate" 
            value={`${context.currentOccupancy}%`} 
            trend={-0.5} 
            icon={<Users size={20} />} 
          />
          <MetricCard 
            label="Profit Velocity" 
            value={`+${(context.targetProfitability / context.timeframe).toFixed(1)}%/mo`} 
            icon={<Target size={20} />} 
          />
        </div>

        {/* Charts & Market Pulse */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" />
                Profitability Projection
              </h3>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-indigo-500" /> Projected</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-indigo-200" /> Actual</div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projections}>
                  <defs>
                    <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Profit']}
                  />
                  <Area type="monotone" dataKey="projected" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorProj)" />
                  <Area type="monotone" dataKey="actual" stroke="#c7d2fe" strokeWidth={3} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Search size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-400" />
                Market Pulse
              </h3>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-800 rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {analysis?.marketSentiment || "Search grounding analysis pending..."}
                  </p>
                  <div className="pt-4">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Competitor Insight</p>
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      "{analysis?.competitorTrends || "No trends found for this query."}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Plan Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-2xl text-slate-900 flex items-center gap-3">
              <Target size={24} className="text-indigo-600" />
              Strategic Action Plan
            </h3>
            {analysis?.groundingSources && analysis.groundingSources.length > 0 && (
              <div className="flex gap-2">
                {analysis.groundingSources.slice(0, 3).map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    title={source.title}
                  >
                    Source {idx + 1} <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 h-48 animate-pulse">
                  <div className="h-4 w-1/4 bg-slate-100 rounded mb-4" />
                  <div className="h-6 w-3/4 bg-slate-100 rounded mb-3" />
                  <div className="h-4 w-full bg-slate-50 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysis?.recommendations.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} />
              ))}
              {!analysis && !error && (
                <div className="col-span-full py-20 text-center">
                  <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-indigo-600" size={32} />
                  </div>
                  <h4 className="text-slate-800 font-bold text-lg">No Analysis Available</h4>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2">Update your hotel context and trigger a new market scan to see recommendations.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Grounding Footer */}
        {analysis?.groundingSources && analysis.groundingSources.length > 0 && (
          <footer className="mt-12 pt-8 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Market Grounding Data</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysis.groundingSources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white p-3 rounded-xl border border-slate-100 hover:border-indigo-200 flex flex-col gap-1 transition-all group"
                >
                  <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{source.uri}</span>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 truncate">{source.title}</span>
                </a>
              ))}
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};

export default App;
