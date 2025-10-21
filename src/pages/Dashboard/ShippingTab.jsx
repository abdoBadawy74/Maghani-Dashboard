import { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { PulseLoader } from "react-spinners";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function ShippingTab() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `https://api.maghni.acwad.tech/api/v1/dashboard/shipping/stats`,
                {
                    params: {
                        startDate: startDate || undefined,
                        endDate: endDate || undefined,
                    },
                }
            );
            setData(res.data);
        } catch (err) {
            console.error("Error fetching shipping data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-10">
            <h2 className="text-2xl font-bold mb-4">Shipping Statistics</h2>

            {/* Date Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
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
                    onClick={fetchData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition self-end"
                >
                    {loading ? "Loading..." : "Apply Filters"}
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-10">
                    <PulseLoader color="#2563eb" />
                </div>
            )}

            {/* No Data */}
            {!loading && !data && (
                <p className="text-center text-gray-600">No data available.</p>
            )}

            {/* Data Display */}
            {!loading && data && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SummaryCard
                            title="Total Shipping Revenue"
                            value={data.totalShippingRevenue}
                            color="bg-blue-500"
                            suffix=" EGP"
                        />
                        <SummaryCard
                            title="Average Shipping Cost"
                            value={data.averageShippingCost}
                            color="bg-green-500"
                            suffix=" EGP"
                        />
                        <SummaryCard
                            title="Average Delivery Time"
                            value={data.averageDeliveryTime}
                            color="bg-purple-500"
                            suffix=" days"
                        />
                    </div>

                    {/* Orders by Shipping Status */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">
                            Orders by Shipping Status
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.ordersByShippingStatus}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {data.ordersByShippingStatus.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value}`, "Orders"]}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
}

function SummaryCard({ title, value, color, suffix }) {
    return (
        <div className={`p-5 rounded-xl text-white shadow ${color}`}>
            <h4 className="text-sm uppercase opacity-80">{title}</h4>
            <p className="text-2xl font-bold mt-1">
                <CountUp end={value || 0} duration={2.5} separator="," decimals={2} />{" "}
                {suffix}
            </p>
        </div>
    );
}
