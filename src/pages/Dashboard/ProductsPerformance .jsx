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
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";

export default function ProductsTab() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `https://api.maghni.acwad.tech/api/v1/dashboard/products/performance`,
                {
                    params: {
                        startDate: startDate || undefined,
                        endDate: endDate || undefined,
                    },
                }
            );
            setData(res.data);
        } catch (err) {
            console.error("Error fetching products data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-10">
            <h2 className="text-2xl font-bold mb-4">Products Performance</h2>

            {/* Date Filter Section */}
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

            {/* Loading Spinner */}
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
                            title="Total Products"
                            value={data.totalProducts}
                            color="bg-blue-500"
                            suffix=""
                        />
                        <SummaryCard
                            title="Average Product Price"
                            value={data.averageProductPrice}
                            color="bg-green-500"
                            suffix=" EGP"
                        />
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">
                            Top Selling Products
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.topSellingProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="productName"
                                    tickFormatter={(name) => {
                                        try {
                                            return JSON.parse(name).ar;
                                        } catch {
                                            return name;
                                        }
                                    }}
                                />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name) =>
                                        name === "totalRevenue"
                                            ? [`${value} EGP`, "Revenue"]
                                            : [value, "Sold"]
                                    }
                                    labelFormatter={(label) => {
                                        try {
                                            return JSON.parse(label).ar;
                                        } catch {
                                            return label;
                                        }
                                    }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="totalSold"
                                    fill="#3b82f6"
                                    name="Total Sold"
                                />
                                <Bar
                                    dataKey="totalRevenue"
                                    fill="#10b981"
                                    name="Total Revenue (EGP)"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Products by Category */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">
                            Products by Category
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.productsByCategory}
                                    dataKey="count"
                                    nameKey="categoryName"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={(entry) => {
                                        try {
                                            return JSON.parse(entry.categoryName).ar;
                                        } catch {
                                            return entry.categoryName;
                                        }
                                    }}
                                >
                                    {data.productsByCategory.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value}`, "Products"]}
                                    labelFormatter={(label) => {
                                        try {
                                            return JSON.parse(label).ar;
                                        } catch {
                                            return label;
                                        }
                                    }}
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
