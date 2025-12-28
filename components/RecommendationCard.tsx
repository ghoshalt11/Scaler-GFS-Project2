
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const priorityColors = {
    High: 'bg-rose-100 text-rose-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-sky-100 text-sky-700',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors group">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
          {recommendation.category}
        </span>
        <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${priorityColors[recommendation.priority]}`}>
          {recommendation.priority} Priority
        </span>
      </div>
      <h4 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{recommendation.action}</h4>
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{recommendation.goal}</p>
      <div className="pt-4 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Estimated Impact</p>
        <p className="text-sm font-medium text-emerald-600">{recommendation.impact}</p>
      </div>
    </div>
  );
};
