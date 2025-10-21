// src/pages/SuperAdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PulseLoader } from "react-spinners";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from "recharts";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function SuperAdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchSuperAdmin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSuperAdmin = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                "https://api.maghni.acwad.tech/api/v1/dashboard/super-admin",
                {
                    params: {
                        startDate: startDate || undefined,
                        endDate: endDate || undefined,
                    },
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                }
            );

            setData(res.data);
            toast.success("Dashboard data loaded");
        } catch (err) {
            console.error("Error loading super-admin dashboard:", err);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <PulseLoader color="#2563eb" size={12} />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6">
                <ToastContainer />
                <p className="text-red-600">No dashboard data available.</p>
            </div>
        );
    }

    // helpers to protect against missing fields
    const overview = data.overview || {};
    const revenue = data.revenue || {};
    const orders = data.orders || {};
    const products = data.products || {};
    const users = data.users || {};
    const vendors = data.vendors || {};
    const topPerformers = data.topPerformers || {};
    const recentActivity = data.recentActivity || {};

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer />
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold">Super Admin </h1>
                {/* Date Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            className="border rounded-md px-2 py-1"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            className="border rounded-md px-2 py-1"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={fetchSuperAdmin}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition self-end"
                    >
                        {loading ? "Loading..." : "Apply Filters"}
                    </button>
                </div>

            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                <StatCard title="Total Revenue" value={overview.totalRevenue} color="bg-green-600" suffix="EGP" />
                <StatCard title="Total Orders" value={overview.totalOrders} color="bg-blue-600" />
                <StatCard title="Total Users" value={overview.totalUsers} color="bg-indigo-600" />
                <StatCard title="Total Products" value={overview.totalProducts} color="bg-yellow-600" />
                <StatCard title="Total Vendors" value={overview.totalVendors} color="bg-pink-600" />
                <StatCard title="Avg Order Value" value={overview.averageOrderValue} color="bg-purple-600" suffix="EGP" decimals={2} />
            </div>

            {/* Main grid: Revenue chart | Orders pie | Revenue by vendor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue timeline chart */}
                <div className="bg-white rounded-2xl shadow p-4 col-span-2">
                    <h2 className="text-lg font-semibold mb-3">Daily Revenue</h2>
                    {revenue?.dailyRevenue && revenue?.dailyRevenue.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={[...(revenue?.dailyRevenue || [])].sort((a, b) => new Date(a.date) - new Date(b.date))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
                                <YAxis />
                                <Tooltip formatter={(val) => `${val} EGP`} labelFormatter={(d) => new Date(d).toLocaleString()} />
                                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500">No daily revenue data</p>
                    )}
                </div>

                {/* Orders by status pie */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <h2 className="text-lg font-semibold mb-3">Orders by Status</h2>
                    {orders.ordersByStatus && orders.ordersByStatus.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={orders.ordersByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                                    {orders.ordersByStatus.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500">No orders status data</p>
                    )}
                </div>
            </div>

            {/* Two column: Revenue by vendor + Orders payment breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-lg font-semibold mb-3">Revenue by Vendor</h3>
                    {revenue.revenueByVendor && revenue.revenueByVendor.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={revenue.revenueByVendor}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="vendorName" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${value} EGP`} />
                                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-3">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2 text-left">Vendor</th>
                                            <th className="p-2 text-right">Revenue</th>
                                            <th className="p-2 text-right">Orders</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {revenue.revenueByVendor.map((v) => (
                                            <tr key={v.vendorId} className="border-b">
                                                <td className="p-2">{v.vendorName}</td>
                                                <td className="p-2 text-right">{Number(v.revenue).toLocaleString()} EGP</td>
                                                <td className="p-2 text-right">{v.orderCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">No vendor revenue data</p>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-lg font-semibold mb-3">Orders Payment Breakdown</h3>

                    {/* Payment status bar */}
                    {orders.ordersByPaymentStatus && orders.ordersByPaymentStatus.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={orders.ordersByPaymentStatus}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="paymentStatus" />
                                <YAxis />
                                <Tooltip formatter={(value) => `${value} ${typeof value === "number" ? "" : ""}`} />
                                <Legend />
                                <Bar dataKey="count" name="Orders" fill="#2563eb" />
                                <Bar dataKey="amount" name="Amount (EGP)" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500">No payment status data</p>
                    )}

                    {/* Payment methods */}
                    <div className="mt-4">
                        <h4 className="font-medium mb-2">By Payment Method</h4>
                        {orders.ordersByPaymentMethod && orders.ordersByPaymentMethod.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Method</th>
                                        <th className="p-2 text-right">Orders</th>
                                        <th className="p-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.ordersByPaymentMethod.map((m) => (
                                        <tr key={m.paymentMethod} className="border-b">
                                            <td className="p-2">{m.paymentMethod}</td>
                                            <td className="p-2 text-right">{m.count}</td>
                                            <td className="p-2 text-right">{Number(m.amount).toLocaleString()} EGP</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">No payment method data</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Products and Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Top Selling Products */}
                <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-3">Top Selling Products</h3>
                    {products.topSellingProducts && products.topSellingProducts.length > 0 ? (
                        <div className="space-y-3">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Product</th>
                                        <th className="p-2 text-right">Sold</th>
                                        <th className="p-2 text-right">Revenue</th>
                                        <th className="p-2 text-right">Orders</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.topSellingProducts.map((p) => {
                                        // productName in response may be a JSON string: try parse safely
                                        let name = p.productName;
                                        try {
                                            const parsed = JSON.parse(p.productName);
                                            name = parsed?.en || parsed?.ar || p.productName;
                                        } catch (e) {
                                            // ignore parse error, use original
                                        }
                                        return (
                                            <tr key={p.productId} className="border-b">
                                                <td className="p-2">{name}</td>
                                                <td className="p-2 text-right">{p.totalSold}</td>
                                                <td className="p-2 text-right">{Number(p.totalRevenue || p.revenue || 0).toLocaleString()} EGP</td>
                                                <td className="p-2 text-right">{p.orderCount ?? "-"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No top products data</p>
                    )}
                </div>

                {/* Top Vendors / Customers summary */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-lg font-semibold mb-3">Top Performers</h3>

                    <div className="mb-4">
                        <h4 className="font-medium">Vendors</h4>
                        {topPerformers.topVendors && topPerformers.topVendors.length > 0 ? (
                            <ul className="space-y-2 mt-2">
                                {topPerformers.topVendors.map((v) => (
                                    <li key={v.vendorId} className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">{v.vendorName}</div>
                                            <div className="text-xs text-gray-500">Orders: {v.orderCount}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{Number(v.revenue).toLocaleString()} EGP</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No top vendors</p>
                        )}
                    </div>

                    <div>
                        <h4 className="font-medium">Top Customers</h4>
                        {topPerformers.topCustomers && topPerformers.topCustomers.length > 0 ? (
                            <ul className="space-y-2 mt-2">
                                {topPerformers.topCustomers.map((c) => (
                                    <li key={c.userId} className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">{c.name}</div>
                                            <div className="text-xs text-gray-500">Orders: {c.orderCount}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{Number(c.totalSpent).toLocaleString()} EGP</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No top customers</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Users & Vendors summaries + recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow p-4">
                    <h4 className="font-semibold mb-3">Users</h4>
                    <div className="space-y-2">
                        <StatSmall label="Total Users" value={users.totalUsers} />
                        <StatSmall label="New Users" value={users.newUsers} />
                        <StatSmall label="Active Users" value={users.activeUsers} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-4">
                    <h4 className="font-semibold mb-3">Vendors</h4>
                    <div className="space-y-2">
                        <StatSmall label="Total Vendors" value={vendors.totalVendors} />
                        <StatSmall label="Active Vendors" value={vendors.activeVendors} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-4">
                    <h4 className="font-semibold mb-3">Recent Activity</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                        <div>
                            <div className="font-medium">Recent Orders</div>
                            <ul className="text-sm mt-2 space-y-2">
                                {(recentActivity.recentOrders || []).slice(0, 6).map((o) => (
                                    <li key={o.id} className="flex justify-between">
                                        <span>{o.orderNumber} — {o.user?.fullName || "—"}</span>
                                        <span className="font-semibold">{o.totalAmount} EGP</span>
                                    </li>
                                ))}
                                {(!recentActivity.recentOrders || recentActivity.recentOrders.length === 0) && (
                                    <li className="text-gray-500">No recent orders</li>
                                )}
                            </ul>
                        </div>
                        <hr />
                        <div>
                            <div className="font-medium mt-2">Recent Users</div>
                            <ul className="text-sm mt-2 space-y-2">
                                {(recentActivity.recentUsers || []).slice(0, 6).map((u) => (
                                    <li key={u.id} className="flex justify-between">
                                        <span>{u.fullName || u.email}</span>
                                        <span className="text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>
                                    </li>
                                ))}
                                {(!recentActivity.recentUsers || recentActivity.recentUsers.length === 0) && (
                                    <li className="text-gray-500">No recent users</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer small note */}
            <div className="text-sm text-gray-500">
                Generated at: {data.generatedAt ? new Date(data.generatedAt).toLocaleString() : "n/a"}
            </div>
        </div>
    );
}

/* ---------- Small reusable components ---------- */

function StatCard({ title, value, color = "bg-gray-700", suffix = "", decimals = 0 }) {
    return (
        <div className={`${color} text-white p-4 rounded-xl shadow flex flex-col justify-between`}>
            <div>
                <div className="text-sm opacity-90">{title}</div>
                <div className="text-2xl font-bold mt-2">
                    <CountUp end={Number(value) || 0} duration={1.8} separator="," decimals={decimals} />
                    {suffix && <span className="ml-1 text-sm">{suffix}</span>}
                </div>
            </div>
        </div>
    );
}

function StatSmall({ label, value }) {
    return (
        <div className="flex justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="font-semibold">{Number(value || 0).toLocaleString()}</span>
        </div>
    );
}
