import { useState, Suspense } from "react";
import DashboardOverview from "./DashboardOverview";
import RecentActivity from "./RecentActivity";
import RevenueTimeline from "./RevenueTimeline";
import { PulseLoader } from "react-spinners";

/*
  Simple Tabs layout.
  We'll lazy-load other sections later (they can be separate components).
*/
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { key: "overview", label: "Overview" },
        { key: "revenue", label: "Revenue" },
        { key: "orders", label: "Orders" },
        { key: "users", label: "Users" },
        { key: "vendors", label: "Vendors" },
        { key: "products", label: "Products" },
        { key: "coupons", label: "Coupons" },
        { key: "shipping", label: "Shipping" },
        { key: "trends", label: "Trends" },
        { key: "system", label: "System" },
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
