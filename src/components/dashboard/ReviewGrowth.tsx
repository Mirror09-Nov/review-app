'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ReviewGrowthData {
  month: string;
  published: number;
  pending: number;
  rating: number;
}

interface ReviewGrowthProps {
  data: ReviewGrowthData[];
}

export const ReviewGrowth = ({ data }: ReviewGrowthProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">レビュー成長の見える化</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">公開・未公開レビュー</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="published" fill="#3b82f6" name="公開済み" />
              <Bar dataKey="pending" fill="#10b981" name="未公開" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">平均評価推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <Tooltip formatter={(value) => [`${value}/5`, '評価']} />
              <Line type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📝 今月のレビュー</h4>
          <p className="text-2xl font-bold text-blue-800">
            {data[data.length - 1]?.published || 0}件
          </p>
          <p className="text-sm text-blue-700">公開済み</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">⏳ 承認待ち</h4>
          <p className="text-2xl font-bold text-green-800">
            {data[data.length - 1]?.pending || 0}件
          </p>
          <p className="text-sm text-green-700">未公開</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⭐ 平均評価</h4>
          <p className="text-2xl font-bold text-yellow-800">
            {data[data.length - 1]?.rating || 0}/5
          </p>
          <p className="text-sm text-yellow-700">今月の平均</p>
        </div>
      </div>
    </div>
  );
};