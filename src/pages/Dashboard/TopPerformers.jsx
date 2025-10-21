import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

export default function TopPerformers() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchTopPerformers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://api.maghni.acwad.tech/api/v1/dashboard/top-performers`, {
                params: { startDate, endDate },
            });
            setData(res.data);
            toast.success("Top performers loaded successfully!");
        } catch (err) {
            toast.error("Failed to fetch top performers!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopPerformers();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🏆 Top Performers</h2>

            {/* Date filters */}
            <div className="flex flex-wrap gap-3 mb-6 items-center">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">Start Date</label>
                    <input
                        type="date"
                        className="border rounded px-3 py-2"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">End Date</label>
                    <input
                        type="date"
                        className="border rounded px-3 py-2"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <button
                    onClick={fetchTopPerformers}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 self-end"
                >
                    Filter
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <PulseLoader color="#2563eb" />
                </div>
            ) : (
                data && (
                    <div className="space-y-8">
                        {/* Top Products */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">🛒 Top Products</h3>
                            <table className="w-full border text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Product</th>
                                        <th className="p-2 border">Total Sold</th>
                                        <th className="p-2 border">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.topProducts?.map((p) => {
                                        const name = JSON.parse(p.productName || "{}");
                                        return (
                                            <tr key={p.productId} className="hover:bg-gray-50">
                                                <td className="p-2 border">{name.en}</td>
                                                <td className="p-2 border">{p.totalSold}</td>
                                                <td className="p-2 border">{p.revenue}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Top Vendors */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">🧑‍🍳 Top Vendors</h3>
                            <table className="w-full border text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Vendor</th>
                                        <th className="p-2 border">Orders</th>
                                        <th className="p-2 border">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.topVendors?.map((v) => (
                                        <tr key={v.vendorId} className="hover:bg-gray-50">
                                            <td className="p-2 border">{v.vendorName}</td>
                                            <td className="p-2 border">{v.orderCount}</td>
                                            <td className="p-2 border">{v.revenue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Top Customers */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">👤 Top Customers</h3>
                            <table className="w-full border text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Customer</th>
                                        <th className="p-2 border">Orders</th>
                                        <th className="p-2 border">Total Spent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.topCustomers?.map((c) => (
                                        <tr key={c.userId} className="hover:bg-gray-50">
                                            <td className="p-2 border">{c.name}</td>
                                            <td className="p-2 border">{c.orderCount}</td>
                                            <td className="p-2 border">{c.totalSpent}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
