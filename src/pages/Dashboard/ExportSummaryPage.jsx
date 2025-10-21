// src/pages/DashboardReports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PulseLoader } from "react-spinners";
import CountUp from "react-countup";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";

export default function DashboardReports() {
    const token = localStorage.getItem("token");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState(null);
    const [payments, setPayments] = useState(null);
    const [addons, setAddons] = useState([]);
    const [customers, setCustomers] = useState([]);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9932CC"];

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const params = {
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            };

            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [summaryRes, paymentsRes, addonsRes, customersRes] = await Promise.all([
                axios.get("https://api.maghni.acwad.tech/api/v1/dashboard/export/summary", { params, headers }),
                axios.get("https://api.maghni.acwad.tech/api/v1/dashboard/payments/analytics", { params, headers }),
                axios.get("https://api.maghni.acwad.tech/api/v1/dashboard/addons/stats", { params, headers }),
                axios.get("https://api.maghni.acwad.tech/api/v1/dashboard/customers/lifetime-value", { params, headers }),
            ]);

            setSummary(summaryRes.data);
            setPayments(paymentsRes.data);
            setAddons(addonsRes.data);
            setCustomers(customersRes.data);
            toast.success("Dashboard data loaded");
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800">Dashboard Reports</h1>

                {/* Date filters */}
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            className="border rounded-md px-2 py-1"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            className="border rounded-md px-2 py-1"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={fetchAll}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* ===== Summary Cards ===== */}
            {summary?.summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                    <StatCard title="Total Revenue" value={summary.summary.totalRevenue} color="bg-green-600" suffix="EGP" />
                    <StatCard title="Total Orders" value={summary.summary.totalOrders} color="bg-blue-600" />
                    <StatCard title="Total Users" value={summary.summary.totalUsers} color="bg-indigo-600" />
                    <StatCard title="Total Vendors" value={summary.summary.totalVendors} color="bg-pink-600" />
                    <StatCard title="Total Products" value={summary.summary.totalProducts} color="bg-yellow-600" />
                    <StatCard
                        title="Avg Order Value"
                        value={summary.summary.averageOrderValue}
                        color="bg-purple-600"
                        suffix="EGP"
                        decimals={2}
                    />
                </div>
            )}

            {/* ===== Top Performers ===== */}
            {summary?.topPerformers && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <TableCard
                        title="Top Products"
                        columns={["Product", "Sold", "Revenue"]}
                        data={summary.topPerformers.topProducts.map((p) => ({
                            col1: JSON.parse(p.productName).en,
                            col2: p.totalSold,
                            col3: `${p.revenue} EGP`,
                        }))}
                    />
                    <TableCard
                        title="Top Vendors"
                        columns={["Vendor", "Orders", "Revenue"]}
                        data={summary.topPerformers.topVendors.map((v) => ({
                            col1: v.vendorName,
                            col2: v.orderCount,
                            col3: `${v.revenue} EGP`,
                        }))}
                    />
                    <TableCard
                        title="Top Customers"
                        columns={["Customer", "Orders", "Spent"]}
                        data={summary.topPerformers.topCustomers.map((c) => ({
                            col1: c.name,
                            col2: c.orderCount,
                            col3: `${c.totalSpent} EGP`,
                        }))}
                    />
                </div>
            )}

            {/* ===== Payment Analytics with Chart ===== */}
            {payments && (
                <div className="bg-white p-4 rounded-2xl shadow mb-8">
                    <h2 className="text-lg font-semibold mb-4">Payment Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium mb-2">Payment Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={payments.paymentMethodDistribution}
                                        dataKey="totalAmount"
                                        nameKey="paymentMethod"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {payments.paymentMethodDistribution.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Failed Payments Summary</h3>
                            <p>Count: {payments.failedPayments.count}</p>
                            <p>Lost Revenue: {payments.failedPayments.lostRevenue} EGP</p>
                            <p>Avg Processing Time: {payments.averageProcessingTime}s</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Addons Stats with Chart ===== */}
            {addons && addons.length > 0 && (
                <div className="bg-white p-4 rounded-2xl shadow mb-8">
                    <h2 className="text-lg font-semibold mb-4">Addons Stats</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Addon</th>
                                        <th className="p-2 text-right">Used</th>
                                        <th className="p-2 text-right">Revenue</th>
                                        <th className="p-2 text-right">Avg Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addons.map((a, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="p-2">{a.addonName.en}</td>
                                            <td className="p-2 text-right">{a.usageCount}</td>
                                            <td className="p-2 text-right">{a.totalRevenue} EGP</td>
                                            <td className="p-2 text-right">{a.averagePrice} EGP</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={addons}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="addonName.en" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="totalRevenue" fill="#8884d8" name="Revenue (EGP)" />
                                    <Bar dataKey="usageCount" fill="#82ca9d" name="Usage Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Customers Lifetime Value ===== */}
            {customers && customers.length > 0 && (
                <div className="bg-white p-4 rounded-2xl shadow mb-8">
                    <h2 className="text-lg font-semibold mb-4">Customers Lifetime Value</h2>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">Customer</th>
                                <th className="p-2 text-left">Email</th>
                                <th className="p-2 text-right">Orders</th>
                                <th className="p-2 text-right">Lifetime Value</th>
                                <th className="p-2 text-right">Avg Order Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c) => (
                                <tr key={c.userId} className="border-b">
                                    <td className="p-2">{c.name}</td>
                                    <td className="p-2">{c.email}</td>
                                    <td className="p-2 text-right">{c.orderCount}</td>
                                    <td className="p-2 text-right">{c.lifetimeValue} EGP</td>
                                    <td className="p-2 text-right">{c.averageOrderValue} EGP</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* --- Small Components --- */
function StatCard({ title, value, color, suffix = "", decimals = 0 }) {
    return (
        <div className={`${color} text-white p-4 rounded-xl shadow`}>
            <div className="text-sm opacity-80">{title}</div>
            <div className="text-2xl font-bold mt-2">
                <CountUp end={Number(value) || 0} duration={1.5} separator="," decimals={decimals} />
                {suffix && <span className="ml-1 text-sm">{suffix}</span>}
            </div>
        </div>
    );
}

function TableCard({ title, columns, data }) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
            <table className="w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((c, i) => (
                            <th key={i} className={`p-2 ${i === 0 ? "text-left" : "text-right"}`}>{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((d, idx) => (
                        <tr key={idx} className="border-b">
                            <td className="p-2">{d.col1}</td>
                            <td className="p-2 text-right">{d.col2}</td>
                            <td className="p-2 text-right">{d.col3}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
