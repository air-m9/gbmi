import React from 'react';
import { HealthAdvice } from '../types';

interface AdviceCardProps {
  advice: HealthAdvice | null;
  loading: boolean;
  onGenerate: () => void;
  hasResult: boolean;
}

const AdviceCard: React.FC<AdviceCardProps> = ({ advice, loading, onGenerate, hasResult }) => {
  if (!hasResult) return null;

  return (
    <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all duration-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          AI Health Insights
        </h3>
        {!advice && !loading && (
          <button
            onClick={onGenerate}
            className="text-xs font-medium bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
          >
            Generate Tips
          </button>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-100 rounded w-3/4"></div>
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6"></div>
        </div>
      ) : advice ? (
        <div className="space-y-4 animate-fadeIn">
          <p className="text-slate-600 text-sm italic border-l-4 border-indigo-200 pl-3">
            "{advice.summary}"
          </p>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Actionable Tips</h4>
            <ul className="space-y-2">
              {advice.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg">
                  <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-slate-400 text-sm">
          Get personalized health tips powered by Google Gemini based on your current BMI.
        </p>
      )}
    </div>
  );
};

export default AdviceCard;
