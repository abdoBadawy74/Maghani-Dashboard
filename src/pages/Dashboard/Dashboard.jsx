import { useState, Suspense } from "react";
import DashboardOverview from "./DashboardOverview";
import RecentActivity from "./RecentActivity";
import RevenueTimeline from "./RevenueTimeline";
import { PulseLoader } from "react-spinners";
import TopPerformers from "./TopPerformers";
import RevenueTab from "./RevenueTab";
import OrdersTab from "./OrdersTab";

/*
  Simple Tabs layout.
  We'll lazy-load other sections later (they can be separate components).
*/
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { key: "overview", label: "Overview" },        // ✅ overview/quick + recent-activity + revenue/timeline
        { key: "revenue", label: "Revenue" },          // ✅ revenue/breakdown + revenue/timeline
        { key: "orders", label: "Orders" },            // ✅ orders/status-breakdown
        { key: "users", label: "Users" },              // ✅ users/statistics + user/growth-trend
        { key: "vendors", label: "Vendors" },          // ✅ vendors/performance
        { key: "products", label: "Products" },        // ✅ products/performance
        { key: "coupons", label: "Coupons" },          // ✅ coupons/usage
        { key: "shipping", label: "Shipping" },        // ✅ shipping/stats
        { key: "trends", label: "Trends" },            // ✅ trends + geographic/stats
        { key: "system", label: "System" },            // ✅ super-admin + addons/stats + export/summary + payments/analytics + customer/lifetime-value
        { key: "top", label: "Top Performers" }        // ✅ top-performers
    ];


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold mb-6">Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`px-4 py-2 rounded-lg font-medium ${activeTab === t.key
                            ? "bg-blue-600 text-white shadow"
                            : "bg-white border text-gray-700"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === "overview" && (
                    <Suspense fallback={<div className="flex justify-center py-20"><PulseLoader /></div>}>
                        <DashboardOverview />
                        <RecentActivity />
                        <RevenueTimeline />
                    </Suspense>
                )}

                {activeTab === "top" && (
                    <Suspense fallback={<div className="flex justify-center py-20"><PulseLoader /></div>}>
                        <TopPerformers />
                    </Suspense>
                )}

                {activeTab === "revenue" && (
                    <Suspense fallback={<div className="flex justify-center py-20"><PulseLoader /></div>}>
                        <RevenueTab />
                    </Suspense>
                )}

                {activeTab === "orders" && (
                    <Suspense fallback={<div className="flex justify-center py-20"><PulseLoader /></div>}>
                        <OrdersTab />
                    </Suspense>
                )}

                {/* Placeholder for other tabs: lazy-load them later */}
                {activeTab !== "overview" && (
                    <div className="bg-white rounded-lg shadow p-8 text-gray-600">
                        <p className="font-medium">Section "{activeTab}" not implemented yet.</p>
                        <p className="text-sm text-gray-500 mt-2">
                            I can scaffold this section next — tell me which one you want after Overview.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
