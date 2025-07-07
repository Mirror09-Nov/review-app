import { Star, DollarSign, TrendingUp, Users } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { SalesInsights } from '@/components/dashboard/SalesInsights';
import { CompetitorComparison } from '@/components/dashboard/CompetitorComparison';
import { EmployeeGrowth } from '@/components/dashboard/EmployeeGrowth';
import { sampleDashboardData } from '@/lib/sample-dashboard-data';

export default function DashboardPage() {
  // Use sample data for demonstration
  const { kpis, salesData, competitorData, employeeGrowth } = sampleDashboardData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">店舗経営改善ダッシュボード</h1>
        <p className="text-gray-600 mt-2">Phase 1 - KPI概要とインサイト</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="顧客評価"
          value={kpis.rating}
          icon={Star}
          change="+0.2 前月比"
          changeType="positive"
          unit="/5.0"
        />
        <KPICard
          title="今月のチップ"
          value={kpis.tips.toLocaleString()}
          icon={DollarSign}
          change="+12% 前月比"
          changeType="positive"
          unit="円"
        />
        <KPICard
          title="地域ランキング"
          value={kpis.ranking}
          icon={TrendingUp}
          change="↑2位 前月比"
          changeType="positive"
          unit="位"
        />
        <KPICard
          title="成長従業員数"
          value={kpis.employees}
          icon={Users}
          change="+3名 前月比"
          changeType="positive"
          unit="名"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <SalesInsights data={salesData} />
        <CompetitorComparison data={competitorData} />
      </div>

      {/* Employee Growth */}
      <div className="mb-8">
        <EmployeeGrowth data={employeeGrowth} />
      </div>
    </div>
  );
}