'use client';

import { type LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  unit?: string;
}

export const KPICard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral', 
  unit = '' 
}: KPICardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className="h-8 w-8 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
      
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">
          {value}
        </span>
        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
      </div>
      
      {change && (
        <div className={`mt-2 text-sm ${getChangeColor()}`}>
          {change}
        </div>
      )}
    </div>
  );
};