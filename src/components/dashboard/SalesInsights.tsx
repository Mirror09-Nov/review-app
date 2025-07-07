'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SalesData {
  month: string;
  sales: number;
  target: number;
  reviews: number;
  rating: number;
}

interface SalesInsightsProps {
  data: SalesData[];
}

export const SalesInsights = ({ data }: SalesInsightsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">売上連動インサイト</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">月別売上実績 vs 目標</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '']} />
              <Bar dataKey="sales" fill="#3b82f6" name="実績" />
              <Bar dataKey="target" fill="#e5e7eb" name="目標" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">売上トレンド</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '']} />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="実績" />
              <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" name="目標" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📈 インサイト</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 5月以降、売上目標を上回る成長を達成</li>
          <li>• 前月比+6.7%の成長率を維持</li>
          <li>• 競合他社と比較して12%高い成長率</li>
        </ul>
      </div>
    </div>
  );
};