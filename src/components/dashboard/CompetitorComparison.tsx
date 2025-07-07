'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CompetitorData {
  name: string;
  score: number;
  rating: number;
  revenue: number;
  reviewCount: number;
}

interface CompetitorComparisonProps {
  data: CompetitorData[];
}

export const CompetitorComparison = ({ data }: CompetitorComparisonProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">競合比較レポート</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">総合スコア比較</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">詳細比較</h3>
          <div className="space-y-4">
            {data.map((competitor, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{competitor.name}</span>
                  <span className="text-sm text-gray-600">スコア: {competitor.score}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>評価: ⭐ {competitor.rating}</div>
                  <div>売上: ¥{competitor.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">🎯 競合優位性</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• 総合スコア1位を維持（85点）</li>
          <li>• 顧客評価で競合を上回る（4.3/5.0）</li>
          <li>• 売上高で業界平均を8%上回る</li>
        </ul>
      </div>
    </div>
  );
};