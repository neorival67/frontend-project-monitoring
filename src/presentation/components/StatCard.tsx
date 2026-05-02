import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number; // Persentase naik/turun
  trendText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendText }) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </h3>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </span>
        
        {trend !== undefined && (
          <div className="flex items-center gap-2 mt-1">
            <span 
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                isPositive 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                  : isNegative 
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                    : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {isPositive ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {trendText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};