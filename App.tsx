
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
  AlertCircle,
  Sparkles,
  Zap,
  Mail,
  Smartphone,
  UserCheck
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
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
  const [activeTab, setActiveTab] = useState<'overview' | 'guest' | 'pricing'>('overview');

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

  const DeliveryIcon = ({ channel }: { channel: string }) => {
    const c = channel.toLowerCase();
    if (c.includes('email')) return <Mail size={14} />;
    if (c.includes('app') || c.includes('notification')) return <Smartphone size={14} />;
    return <UserCheck size={14} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-6 flex flex-col sticky top-0 md:h-screen z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Hotel className="text-white" size={20} />
          </div>
          <h1 className="font-bold text-white tracking-tight text-xl">Lumina AI</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={18} />
            <span className="font-medium text-sm">Overview</span>
          </button>
          <button onClick={() => setActiveTab('guest')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'guest' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
            <Users size={18} />
            <span className="font-medium text-sm">Guest Intelligence</span>
          </button>
          <button onClick={() => setActiveTab('pricing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'pricing' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
            <Zap size={18} />
            <span className="font-medium text-sm">Dynamic Pricing</span>
          </button>
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
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'overview' && 'Market Intelligence'}
              {activeTab === 'guest' && 'Guest Personalization'}
              {activeTab === 'pricing' && 'Dynamic Rate Engine'}
            </h2>
            <p className="text-slate-500 font-medium">Strategic Hub for {context.city} Portfolio</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={fetchAnalysis} disabled={isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Update AI Model
             </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <>
            {/* Context Inputs */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">City</label>
                <input type="text" value={context.city} onChange={(e) => setContext({...context, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profit Goal (%)</label>
                <input type="number" value={context.targetProfitability} onChange={(e) => setContext({...context, targetProfitability: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Months</label>
                <input type="number" value={context.timeframe} onChange={(e) => setContext({...context, timeframe: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current ADR</label>
                <input type="number" value={context.currentADR} onChange={(e) => setContext({...context, currentADR: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <MetricCard label="Current RevPAR" value={`$${context.currentRevPAR}`} trend={3.2} icon={<DollarSign size={20} />} />
              <MetricCard label="Average Daily Rate" value={`$${context.currentADR}`} trend={1.8} icon={<TrendingUp size={20} />} />
              <MetricCard label="Occupancy Rate" value={`${context.currentOccupancy}%`} trend={-0.5} icon={<Users size={20} />} />
              <MetricCard label="Growth Target" value={`${context.targetProfitability}%`} icon={<Target size={20} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-indigo-600" />Profitability Roadmap</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projections}>
                      <defs>
                        <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" hide />
                      <YAxis hide />
                      <Tooltip contentStyle={{borderRadius: '12px'}} />
                      <Area type="monotone" dataKey="projected" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorProj)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-400"><Sparkles size={18}/> AI Pulse</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{analysis?.marketSentiment || "Fetching latest market dynamics..."}</p>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Top Comp Trend</p>
                  <p className="text-xs text-slate-300 italic">{analysis?.competitorTrends || "Analyzing local set..."}</p>
                </div>
              </div>
            </div>

            <section>
              <h3 className="font-bold text-2xl text-slate-900 mb-6 flex items-center gap-3"><Target size={24} className="text-indigo-600" />Strategic Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysis?.recommendations.map((rec, i) => <RecommendationCard key={i} recommendation={rec} />)}
              </div>
            </section>
          </>
        )}

        {activeTab === 'guest' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
              <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2"><Sparkles className="text-indigo-500" size={24} /> Guest Segmentation Analysis</h3>
              <p className="text-slate-500 text-sm mb-6">AI-driven analysis of transaction data to unlock ancillary revenue.</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {analysis?.segments.map((segment, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-indigo-200 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">{segment.name}</h4>
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">{segment.percentage}%</span>
                    </div>
                    <ul className="space-y-1 mb-6">
                      {segment.characteristics.map((char, j) => (
                        <li key={j} className="text-xs text-slate-600 flex items-center gap-2">
                          <div className="w-1 h-1 bg-indigo-400 rounded-full" /> {char}
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personalized Offers</p>
                      {segment.personalizedOffers.map((offer, k) => (
                        <div key={k} className="bg-white p-3 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-sm text-indigo-600">{offer.title}</p>
                            <div className="text-slate-400 flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded text-[10px]" title={offer.deliveryChannel}>
                              <DeliveryIcon channel={offer.deliveryChannel} />
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{offer.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Zap className="text-amber-500" size={24} /> Dynamic Rate Recommendations</h3>
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Segment / Room Type</th>
                        <th className="px-6 py-4">Current Rate</th>
                        <th className="px-6 py-4">AI Recommended</th>
                        <th className="px-6 py-4">Adjustment Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analysis?.rateAdjustments.map((rate, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">{rate.segment}</td>
                          <td className="px-6 py-4 text-slate-500 font-medium">${rate.currentRate}</td>
                          <td className="px-6 py-4">
                            <span className={`font-bold px-2 py-1 rounded text-sm ${rate.recommendedRate > rate.currentRate ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              ${rate.recommendedRate}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 italic">{rate.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <h4 className="font-bold text-sm text-indigo-400 uppercase mb-4">Market Data Grounding</h4>
                  <div className="space-y-3">
                    {analysis?.groundingSources.slice(0, 5).map((source, i) => (
                      <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="block p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all border border-slate-700">
                        <p className="text-xs font-bold truncate text-indigo-300">{source.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{source.uri}</p>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="bg-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Profitability Impact</p>
                    <p className="text-2xl font-black">+4.2% Est.</p>
                  </div>
                  <TrendingUp size={40} className="opacity-20" />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
