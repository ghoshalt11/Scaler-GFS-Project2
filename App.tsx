
import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Hotel, 
  Search, 
  Target, 
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
  UserCheck,
  Database,
  ArrowRight,
  PieChart as PieChartIcon,
  CreditCard,
  History,
  ChevronRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';
import { HotelContext, MarketAnalysis, ProfitProjection, GuestSegment } from './types';
import { geminiService } from './services/geminiService';
import { MetricCard } from './components/MetricCard';
import { RecommendationCard } from './components/RecommendationCard';

// Simulated raw transaction data to "analyze"
const MOCK_TRANSACTIONS = [
  { id: 'TX-9021', date: '2023-10-12', guest: 'John D.', type: 'Booking', amount: 450, segment: 'Corporate' },
  { id: 'TX-9022', date: '2023-10-12', guest: 'Sarah M.', type: 'Spa', amount: 120, segment: 'Leisure' },
  { id: 'TX-9023', date: '2023-10-13', guest: 'Robert L.', type: 'Dining', amount: 85, segment: 'Leisure' },
  { id: 'TX-9024', date: '2023-10-13', guest: 'Elena P.', type: 'Booking', amount: 620, segment: 'Luxury' },
  { id: 'TX-9025', date: '2023-10-14', guest: 'Mark T.', type: 'Late Checkout', amount: 50, segment: 'Corporate' },
];

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
  const [selectedSegment, setSelectedSegment] = useState<GuestSegment | null>(null);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await geminiService.generateActionPlan(context);
      setAnalysis(result);
      if (result.segments && result.segments.length > 0) {
        setSelectedSegment(result.segments[0]);
      }
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
    const c = (channel || '').toLowerCase();
    if (c.includes('email')) return <Mail size={14} className="text-blue-500" />;
    if (c.includes('app') || c.includes('notification')) return <Smartphone size={14} className="text-indigo-500" />;
    return <UserCheck size={14} className="text-emerald-500" />;
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
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={18} />
            <span className="font-medium text-sm">Strategic Overview</span>
          </button>
          <button onClick={() => setActiveTab('guest')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'guest' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}>
            <Users size={18} />
            <span className="font-medium text-sm">Guest Intelligence</span>
          </button>
          <button onClick={() => setActiveTab('pricing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'pricing' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}>
            <Zap size={18} />
            <span className="font-medium text-sm">Revenue Engine</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white cursor-pointer transition-all">
            <HelpCircle size={18} />
            <span className="font-medium text-sm">Expert Support</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'overview' && 'Market Command Center'}
              {activeTab === 'guest' && 'Guest Personalization'}
              {activeTab === 'pricing' && 'Dynamic Yield Manager'}
            </h2>
            <p className="text-slate-500 font-medium">Powering the {context.targetProfitability}% Growth Strategy</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={fetchAnalysis} disabled={isLoading} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-50">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Run Global Analysis
             </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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
              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group shadow-xl">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-400"><Sparkles size={18}/> AI Pulse</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{analysis?.marketSentiment || "Fetching latest market dynamics..."}</p>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                  <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Top Comp Trend</p>
                  <p className="text-xs text-slate-300 italic">{analysis?.competitorTrends || "Analyzing local set..."}</p>
                </div>
              </div>
            </div>

            <section>
              <h3 className="font-bold text-2xl text-slate-900 mb-6 flex items-center gap-3"><Target size={24} className="text-indigo-600" />Strategic Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysis?.recommendations?.map((rec, i) => <RecommendationCard key={i} recommendation={rec} />)}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'guest' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Data Analysis Feed */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Database className="text-indigo-500" size={20} />
                    <h3 className="font-bold text-slate-800">Raw Guest Data Feed</h3>
                  </div>
                  <div className="space-y-3">
                    {MOCK_TRANSACTIONS.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div>
                          <p className="font-bold text-slate-700">{tx.guest}</p>
                          <p className="text-slate-400">{tx.type} • {tx.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-indigo-600">${tx.amount}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">{tx.segment}</p>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                      <History size={14} /> View All Transactions
                    </button>
                  </div>
                </div>

                <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-4 opacity-10"><PieChartIcon size={80} /></div>
                   <h3 className="font-bold mb-2 relative z-10">AI Segment Discovery</h3>
                   <p className="text-xs text-indigo-100 relative z-10 mb-4">Lumina AI has identified {analysis?.segments?.length || 0} unique high-value segments from your history.</p>
                   <div className="space-y-2 relative z-10">
                     {analysis?.segments?.map((seg, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedSegment(seg)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedSegment?.name === seg.name ? 'bg-white text-indigo-600 shadow-md' : 'bg-indigo-700/50 hover:bg-indigo-700'}`}
                        >
                          <span className="text-xs font-bold">{seg.name}</span>
                          <span className="text-[10px] opacity-80">{seg.percentage}%</span>
                        </button>
                     ))}
                   </div>
                </div>
              </div>

              {/* Right Column: Intelligence & Offers */}
              <div className="lg:col-span-2 space-y-6">
                {selectedSegment ? (
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-black text-slate-900">{selectedSegment.name}</h3>
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                             Segment Share: {selectedSegment.percentage}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedSegment.characteristics?.map((char, i) => (
                            <span key={i} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded uppercase tracking-wider">
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                        <CreditCard className="text-indigo-600" size={24} />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Lifetime Value</p>
                          <p className="text-lg font-black text-indigo-600">$4,250</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                           <Sparkles size={16} className="text-indigo-500" /> 
                           Personalized Ancillary Offers
                        </h4>
                        {selectedSegment.personalizedOffers?.map((offer, i) => (
                          <div key={i} className="group p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-300 hover:bg-white hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight size={18} className="text-indigo-400" />
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <DeliveryIcon channel={offer.deliveryChannel} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 leading-none mb-1">{offer.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{offer.deliveryChannel}</p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">{offer.description}</p>
                            <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                               Deploy Automated Campaign <ChevronRight size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Strategic Delivery Matrix</h4>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="w-1 h-auto bg-blue-500 rounded-full" />
                            <div>
                              <p className="text-xs font-bold text-slate-800 mb-1">Pre-Arrival Strategy</p>
                              <p className="text-[11px] text-slate-500">Target the 'Planning Mindset' via personalized email sequences 48h before check-in.</p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-1 h-auto bg-indigo-500 rounded-full" />
                            <div>
                              <p className="text-xs font-bold text-slate-800 mb-1">In-Stay Engagement</p>
                              <p className="text-[11px] text-slate-500">Push notifications triggered by property geofencing to promote spa and F&B during downtime.</p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-1 h-auto bg-emerald-500 rounded-full" />
                            <div>
                              <p className="text-xs font-bold text-slate-800 mb-1">Departure & Beyond</p>
                              <p className="text-[11px] text-slate-500">Automated feedback loops paired with loyalty enrollment offers to secure repeat bookings.</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-200">
                           <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-400">Ancillary Rev Potential</span>
                              <span className="text-emerald-600">+12.5%</span>
                           </div>
                           <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full w-[75%]" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full bg-white rounded-3xl border border-slate-200 border-dashed flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Users className="text-slate-300" size={32} />
                    </div>
                    <h4 className="text-slate-800 font-bold text-lg">Select a Segment to Analyze</h4>
                    <p className="text-slate-500 max-w-xs text-sm mt-2">Choose an AI-discovered guest segment from the sidebar to view personalized growth strategies.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
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
                      {analysis?.rateAdjustments?.map((rate, i) => (
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
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                  <h4 className="font-bold text-sm text-indigo-400 uppercase mb-4">Real-Time Competitor Set</h4>
                  <div className="space-y-3">
                    {analysis?.groundingSources?.slice(0, 5).map((source, i) => (
                      <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="block p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all border border-slate-700 group">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold truncate text-indigo-300">{source.title}</p>
                          <ExternalLink size={10} className="text-slate-500 group-hover:text-indigo-400" />
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{source.uri}</p>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">RevPAR Impact</p>
                    <p className="text-2xl font-black text-slate-900">+4.2% Est.</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <TrendingUp size={24} className="text-indigo-600" />
                  </div>
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
