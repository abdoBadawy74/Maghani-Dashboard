import { useState, useEffect } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { PulseLoader } from "react-spinners";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function UsersTab() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                "https://api.maghni.acwad.tech/api/v1/dashboard/users/statistics",
                {
                    params: { startDate, endDate },
                }
            );
            setData(res.data);
        } catch (err) {
            console.error("Error fetching user statistics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center py-20">
                <PulseLoader color="#4f46e5" />
            </div>
        );

    if (!data)
        return (
            <p className="text-center text-gray-600">No data available for users.</p>
        );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Users Statistics</h2>

                <div className="flex gap-2 items-center">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <button
                        onClick={fetchData}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        {loading ? "Loading..." : "Apply Filters"}
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SummaryCard title="Total Users" value={data.totalUsers} color="bg-blue-500" />
                <SummaryCard title="New Users" value={data.newUsers} color="bg-green-500" />
                <SummaryCard title="Active Users" value={data.activeUsers} color="bg-purple-500" />
            </div>

            {/* User Growth Chart */}
            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">User Growth Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(d) => new Date(d).toLocaleDateString("en-GB")}
                        />
                        <YAxis />
                        <Tooltip
                            formatter={(value) => [`${value} Users`, "New Users"]}
                            labelFormatter={(d) => new Date(d).toLocaleDateString("en-GB")}
                        />
                        <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Top Spenders Table */}
            <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
                <h3 className="font-semibold text-lg mb-3">Top Spenders</h3>
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Total Spent (EGP)</th>
                            <th className="p-2 border">Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.topSpenders.map((u) => (
                            <tr key={u.userId} className="border-b hover:bg-gray-50">
                                <td className="p-2 border">{u.name}</td>
                                <td className="p-2 border">{u.email}</td>
                                <td className="p-2 border">{u.totalSpent}</td>
                                <td className="p-2 border">{u.orderCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, color }) {
    return (
        <div className={`p-4 rounded-xl text-white shadow ${color}`}>
            <h4 className="text-sm uppercase opacity-80">{title}</h4>
            <p className="text-2xl font-bold mt-1">
                <CountUp end={value || 0} duration={2.5} separator="," />
            </p>
        </div>
    );
}
