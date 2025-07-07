'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface EmployeeGrowthData {
  month: string;
  training: number;
  certification: number;
  satisfaction: number;
  published: number;
  pending: number;
  rating: number;
}

interface EmployeeGrowthProps {
  data: EmployeeGrowthData[];
}

export const EmployeeGrowth = ({ data }: EmployeeGrowthProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">従業員成長の見える化</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">研修・認定実績</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="training" fill="#3b82f6" name="研修完了" />
              <Bar dataKey="certification" fill="#10b981" name="認定取得" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">従業員満足度推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[7, 10]} />
              <Tooltip formatter={(value) => [`${value}/10`, '満足度']} />
              <Line type="monotone" dataKey="satisfaction" stroke="#f59e0b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📚 研修実績</h4>
          <p className="text-2xl font-bold text-blue-800">
            {data[data.length - 1]?.training || 0}名
          </p>
          <p className="text-sm text-blue-700">今月完了</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">🏆 認定取得</h4>
          <p className="text-2xl font-bold text-green-800">
            {data[data.length - 1]?.certification || 0}名
          </p>
          <p className="text-sm text-green-700">今月取得</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">😊 満足度</h4>
          <p className="text-2xl font-bold text-yellow-800">
            {data[data.length - 1]?.satisfaction || 0}/10
          </p>
          <p className="text-sm text-yellow-700">前月比+0.2</p>
        </div>
      </div>
    </div>
  );
};