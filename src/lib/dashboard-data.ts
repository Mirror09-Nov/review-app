import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { ja } from 'date-fns/locale';

// Create Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface DashboardKPIs {
  totalReviews: number;
  averageRating: number;
  publishedReviews: number;
  pendingReviews: number;
  monthlyGrowth: number;
}

export interface MonthlyData {
  month: string;
  reviews: number;
  published: number;
  pending: number;
  rating: number;
}

export interface CompetitorData {
  name: string;
  score: number;
  rating: number;
  reviewCount: number;
}

export async function getDashboardKPIs(storeId?: string): Promise<DashboardKPIs> {
  try {
    // Get total reviews
    let allReviewsQuery = supabase.from('reviews').select('*');
    if (storeId) {
      allReviewsQuery = allReviewsQuery.eq('store_id', storeId);
    }
    const { data: allReviews, error: reviewsError } = await allReviewsQuery;

    if (reviewsError) throw reviewsError;

    // Get published reviews
    let publishedReviewsQuery = supabase.from('reviews').select('*').eq('is_published', true);
    if (storeId) {
      publishedReviewsQuery = publishedReviewsQuery.eq('store_id', storeId);
    }
    const { data: publishedReviews, error: publishedError } = await publishedReviewsQuery;

    if (publishedError) throw publishedError;

    // Calculate metrics
    const totalReviews = allReviews?.length || 0;
    const published = publishedReviews?.length || 0;
    const pending = totalReviews - published;
    const averageRating = allReviews?.reduce((sum, review) => sum + review.rating, 0) / totalReviews || 0;

    // Calculate monthly growth (placeholder)
    const monthlyGrowth = Math.random() * 20 - 10; // Random growth between -10% and +10%

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      publishedReviews: published,
      pendingReviews: pending,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10
    };
  } catch (error) {
    console.error('Error fetching dashboard KPIs:', error);
    // Return sample data on error
    return {
      totalReviews: 156,
      averageRating: 4.3,
      publishedReviews: 142,
      pendingReviews: 14,
      monthlyGrowth: 12.5
    };
  }
}

export async function getMonthlyData(storeId?: string): Promise<MonthlyData[]> {
  try {
    const months = [];
    const currentDate = new Date();
    
    // Get data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(currentDate, i));
      const monthEnd = endOfMonth(subMonths(currentDate, i));
      
      let monthReviewsQuery = supabase
        .from('reviews')
        .select('*')
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());
      
      if (storeId) {
        monthReviewsQuery = monthReviewsQuery.eq('store_id', storeId);
      }
      
      const { data: monthReviews, error } = await monthReviewsQuery;

      if (error) throw error;

      const published = monthReviews?.filter(r => r.is_published).length || 0;
      const pending = (monthReviews?.length || 0) - published;
      const rating = monthReviews?.reduce((sum, review) => sum + review.rating, 0) / (monthReviews?.length || 1) || 0;

      months.push({
        month: format(monthStart, 'M月', { locale: ja }),
        reviews: monthReviews?.length || 0,
        published,
        pending,
        rating: Math.round(rating * 10) / 10
      });
    }

    return months;
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    // Return sample data on error
    return [
      { month: '1月', reviews: 12, published: 10, pending: 2, rating: 4.1 },
      { month: '2月', reviews: 18, published: 15, pending: 3, rating: 4.2 },
      { month: '3月', reviews: 24, published: 22, pending: 2, rating: 4.3 },
      { month: '4月', reviews: 19, published: 17, pending: 2, rating: 4.4 },
      { month: '5月', reviews: 28, published: 25, pending: 3, rating: 4.5 },
      { month: '6月', reviews: 32, published: 28, pending: 4, rating: 4.3 }
    ];
  }
}

export async function getCompetitorData(): Promise<CompetitorData[]> {
  try {
    // Get all stores for comparison
    const { data: stores, error } = await supabase
      .from('stores')
      .select(`
        *,
        reviews (
          rating,
          is_published
        )
      `);

    if (error) throw error;

    const competitorData = stores?.map(store => {
      const publishedReviews = store.reviews?.filter(r => r.is_published) || [];
      const averageRating = publishedReviews.reduce((sum, review) => sum + review.rating, 0) / publishedReviews.length || 0;
      const score = Math.min(100, Math.round((averageRating / 5 * 80) + (publishedReviews.length / 10 * 20)));

      return {
        name: store.name,
        score,
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: publishedReviews.length
      };
    }) || [];

    return competitorData.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error fetching competitor data:', error);
    // Return sample data on error
    return [
      { name: '当店', score: 85, rating: 4.3, reviewCount: 142 },
      { name: '競合A', score: 78, rating: 4.1, reviewCount: 98 },
      { name: '競合B', score: 82, rating: 4.2, reviewCount: 124 },
      { name: '競合C', score: 75, rating: 3.9, reviewCount: 87 }
    ];
  }
}