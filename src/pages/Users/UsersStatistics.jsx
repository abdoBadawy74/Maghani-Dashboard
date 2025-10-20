import { useEffect, useState } from "react";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CountUp from "react-countup";
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
    Legend,
} from "recharts";

export default function UsersStatistics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"];

    const cardColors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-red-500",
        "bg-purple-500",
        "bg-gray-500",
    ];

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                "https://api.maghni.acwad.tech/api/v1/user/dashboard/statistics",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData(res.data.data);
            toast.success("User statistics loaded successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to load user statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-80">
                <PulseLoader color="#2563eb" size={12} />
            </div>
        );
    }

    if (!data) {
        return <div className="text-center text-red-500 mt-10">No data found.</div>;
    }

    const { statistics, roleDistribution, genderDistribution, growthTrend, recentActivities } =
        data;

    const statsEntries = Object.entries(statistics);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer position="top-right" autoClose={2000} />
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Users Statistics</h2>

            {/* --- Statistics Cards (Animated + Colored) --- */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {statsEntries.map(([key, value], index) => (
                    <div
                        key={key}
                        className={`${cardColors[index % cardColors.length]} text-white shadow-md rounded-xl p-5 text-center hover:scale-105 transform transition`}
                    >
                        <p className="text-sm font-medium mb-2 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                        </p>
                        <p className="text-3xl font-extrabold">
                            <CountUp start={0} end={value} duration={1.5} separator="," />
                        </p>
                    </div>
                ))}
            </div>

            {/* --- Role & Gender Distribution --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white shadow-md rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Role Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={roleDistribution}
                                dataKey="percentage"
                                nameKey="role"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={(entry) => `${entry.role}`}
                            >
                                {roleDistribution.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Gender Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={genderDistribution}
                                dataKey="percentage"
                                nameKey="gender"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#10b981"
                                label={(entry) => `${entry.gender}`}
                            >
                                {genderDistribution.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* --- Growth Trend --- */}
            <div className="bg-white shadow-md rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Growth Trend</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={growthTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(d) =>
                                new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                            }
                        />
                        <YAxis />
                        <Tooltip
                            labelFormatter={(d) =>
                                new Date(d).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* --- Recent Activities Table --- */}
            <div className="bg-white shadow-md rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activities</h3>
                <table className="min-w-full text-left border">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 border">Activity</th>
                            <th className="p-3 border">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentActivities.map((a, i) => (
                            <tr key={i} className="border-t hover:bg-gray-50 transition">
                                <td className="p-3">{a.activity}</td>
                                <td className="p-3 font-medium text-blue-600">{a.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
