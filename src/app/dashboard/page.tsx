import { Star, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { SalesInsights } from '@/components/dashboard/SalesInsights';
import { CompetitorComparison } from '@/components/dashboard/CompetitorComparison';
import { ReviewGrowth } from '@/components/dashboard/ReviewGrowth';
import { getDashboardKPIs, getMonthlyData, getCompetitorData } from '@/lib/dashboard-data';

export default async function DashboardPage() {
  // Fetch all dashboard data
  const [kpis, monthlyData, competitorData] = await Promise.all([
    getDashboardKPIs(),
    getMonthlyData(),
    getCompetitorData()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">店舗経営改善ダッシュボード</h1>
        <p className="text-gray-600 mt-2">レビューデータに基づく店舗運営インサイト</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="平均評価"
          value={kpis.averageRating}
          icon={Star}
          change={`${kpis.monthlyGrowth > 0 ? '+' : ''}${kpis.monthlyGrowth}% 前月比`}
          changeType={kpis.monthlyGrowth > 0 ? 'positive' : 'negative'}
          unit="/5.0"
        />
        <KPICard
          title="総レビュー数"
          value={kpis.totalReviews}
          icon={MessageCircle}
          change={`${kpis.publishedReviews + kpis.pendingReviews}件 累計`}
          changeType="neutral"
          unit="件"
        />
        <KPICard
          title="公開済み"
          value={kpis.publishedReviews}
          icon={CheckCircle}
          change={`${Math.round((kpis.publishedReviews / kpis.totalReviews) * 100)}% 公開率`}
          changeType="positive"
          unit="件"
        />
        <KPICard
          title="承認待ち"
          value={kpis.pendingReviews}
          icon={Clock}
          change={`${kpis.pendingReviews}件 要対応`}
          changeType={kpis.pendingReviews > 5 ? 'negative' : 'neutral'}
          unit="件"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <SalesInsights data={monthlyData} />
        <CompetitorComparison data={competitorData} />
      </div>

      {/* Review Growth */}
      <div className="mb-8">
        <ReviewGrowth data={monthlyData} />
      </div>
    </div>
  );
}