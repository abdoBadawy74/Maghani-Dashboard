import { useEffect, useState } from "react";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GrowthTrend() {
    const [data, setData] = useState([]);
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const fetchGrowthTrend = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://api.maghni.acwad.tech/api/v1/user/dashboard/growth-trend?days=${days}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData(res.data.data || []);
            toast.success("Growth trend data loaded successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch growth trend data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrowthTrend();
    }, [days]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer position="top-right" autoClose={2000} />

            <h2 className="text-2xl font-bold mb-6 text-gray-800">User Growth Trend</h2>

            <div className="flex items-center gap-3 mb-6">
                <label className="text-gray-700 font-medium">Days:</label>
                <input
                    type="number"
                    min="1"
                    max="365"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-24"
                />
                <button
                    onClick={fetchGrowthTrend}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <PulseLoader color="#2563eb" size={12} />
                </div>
            ) : data.length === 0 ? (
                <div className="text-center text-red-500">No growth data available.</div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) =>
                                    new Date(date).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                    })
                                }
                            />
                            <YAxis />
                            <Tooltip
                                labelFormatter={(date) =>
                                    new Date(date).toLocaleDateString("en-GB", {
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
            )}
        </div>
    );
}
