'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SalesData {
  month: string;
  reviews: number;
  rating: number;
}

interface SalesInsightsProps {
  data: SalesData[];
}

export const SalesInsights = ({ data }: SalesInsightsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">レビュー分析インサイト</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">月別レビュー数</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reviews" fill="#3b82f6" name="レビュー数" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">評価推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <Tooltip formatter={(value) => [`${value}/5`, '評価']} />
              <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={2} name="平均評価" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📈 インサイト</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• レビュー数が継続的に増加傾向</li>
          <li>• 顧客満足度が向上している</li>
          <li>• 口コミマーケティングが効果を発揮</li>
        </ul>
      </div>
    </div>
  );
};