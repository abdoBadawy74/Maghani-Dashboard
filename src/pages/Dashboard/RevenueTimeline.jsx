import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

const RevenueTimeline = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        startDate: "2025-06-01",
        endDate: "2025-10-21",
        groupBy: "day",
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://api.maghni.acwad.tech/api/v1/dashboard/revenue/timeline?startDate=${filters.startDate}&endDate=${filters.endDate}&groupBy=${filters.groupBy}`
            );
            setData(res.data);
            toast.success("Revenue timeline loaded successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch revenue timeline");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Revenue Timeline</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-end">
                <div>
                    <label className="block text-gray-600 font-medium mb-1">Start Date</label>
                    <input
                        type="date"
                        className="border rounded-lg p-2"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-gray-600 font-medium mb-1">End Date</label>
                    <input
                        type="date"
                        className="border rounded-lg p-2"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-gray-600 font-medium mb-1">Group By</label>
                    <select
                        className="border rounded-lg p-2"
                        value={filters.groupBy}
                        onChange={(e) => setFilters({ ...filters, groupBy: e.target.value })}
                    >
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>

                <button
                    onClick={fetchData}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Apply Filters
                </button>
            </div>

            {/* Chart or Loader */}
            {loading ? (
                <div className="flex justify-center items-center h-[50vh]">
                    <PulseLoader color="#4f46e5" size={15} />
                </div>
            ) : data.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} />
                        <Line type="monotone" dataKey="orderCount" stroke="#16a34a" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-center text-gray-500 text-lg py-10">No data available for this range.</p>
            )}
        </div>
    );
};

export default RevenueTimeline;
