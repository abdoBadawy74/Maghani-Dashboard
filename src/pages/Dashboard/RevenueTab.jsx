import { useEffect, useState } from "react";
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

export default function RevenueTab() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `https://api.maghni.acwad.tech/api/v1/dashboard/revenue/breakdown`,
                { params: { startDate, endDate } }
            );
            setData(res.data);
        } catch (err) {
            console.error("Error fetching revenue data:", err);
        } finally {
            setLoading(false);
        }
    };

    // أول تحميل فقط
    useEffect(() => {
        fetchData();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center py-20">
                <PulseLoader />
            </div>
        );

    if (!data)
        return <p className="text-center text-gray-600">No data available.</p>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-2">
                <h2 className="text-2xl font-bold">Revenue Breakdown</h2>

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
                        className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
                    >
                        Filter
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Revenue"
                    value={data.totalRevenue}
                    color="bg-blue-500"
                />
                <SummaryCard
                    title="Completed Amount"
                    value={data.totalCOMPLETEDAmount}
                    color="bg-green-500"
                />
                <SummaryCard
                    title="Total Discounts"
                    value={data.totalDiscounts}
                    color="bg-yellow-500"
                />
                <SummaryCard
                    title="Total Shipping"
                    value={data.totalShipping}
                    color="bg-purple-500"
                />
            </div>

            {/* Daily Revenue Chart */}
            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Daily Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.dailyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(d) => new Date(d).toLocaleDateString("en-GB")}
                        />
                        <YAxis />
                        <Tooltip
                            formatter={(value) => [`${value} EGP`, "Revenue"]}
                            labelFormatter={(d) =>
                                new Date(d).toLocaleDateString("en-GB")
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563eb"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue by Vendor Table */}
            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Revenue by Vendor</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">Vendor Name</th>
                            <th className="p-2 border">Revenue</th>
                            <th className="p-2 border">Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.revenueByVendor.map((v) => (
                            <tr key={v.vendorId} className="border-b hover:bg-gray-50">
                                <td className="p-2 border">{v.vendorName}</td>
                                <td className="p-2 border">
                                    <CountUp
                                        end={v.revenue || 0}
                                        duration={2.5}
                                        separator=","
                                    />{" "}
                                    EGP
                                </td>
                                <td className="p-2 border">{v.orderCount}</td>
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
                <CountUp end={value || 0} duration={2.5} separator="," /> EGP
            </p>
        </div>
    );
}
