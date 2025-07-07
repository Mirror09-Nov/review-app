import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Home, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "店舗ダッシュボード",
  description: "店舗経営改善ダッシュボード",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <Home className="w-5 h-5 mr-2" />
              ホーム
            </Link>
            <Link href="/dashboard" className="flex items-center text-blue-600 font-medium">
              <BarChart3 className="w-5 h-5 mr-2" />
              ダッシュボード
            </Link>
            <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
              <Settings className="w-5 h-5 mr-2" />
              管理
            </Link>
          </div>
        </div>
      </nav>
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}