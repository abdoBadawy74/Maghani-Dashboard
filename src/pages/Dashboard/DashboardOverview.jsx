import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

const RevenueBreakdown = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchRevenue = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://api.maghni.acwad.tech/api/v1/dashboard/revenue/breakdown`,
                {
                    params: { startDate, endDate },
                }
            );
            setData(res.data);
            toast.success("Revenue data loaded successfully");
        } catch (error) {
            toast.error("Failed to fetch revenue data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenue();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <PulseLoader color="#4f46e5" size={15} />
            </div>
        );

    const cards = [
        {
            title: "Total Revenue",
            value: data?.totalRevenue,
            color: "bg-green-500",
            suffix: " EGP",
        },
        {
            title: "Completed Orders Revenue",
            value: data?.totalCOMPLETEDAmount,
            color: "bg-blue-500",
            suffix: " EGP",
        },
        {
            title: "Total Shipping",
            value: data?.totalShipping,
            color: "bg-purple-500",
            suffix: " EGP",
        },
        {
            title: "Total Discounts",
            value: data?.totalDiscounts,
            color: "bg-red-500",
            suffix: " EGP",
        },
    ];

    return (
        <div className="p-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-end">
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded-lg p-2 w-48"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded-lg p-2 w-48"
                    />
                </div>
                <button
                    onClick={fetchRevenue}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                    Apply
                </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className={`${card.color} text-white p-6 rounded-2xl shadow-lg`}
                    >
                        <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                        <p className="text-3xl font-bold">
                            <CountUp end={card.value || 0} duration={2} separator="," />
                            {card.suffix && <span className="text-sm ml-1">{card.suffix}</span>}
                        </p>
                    </div>
                ))}
            </div>

            {/* Revenue by Vendor */}
            <div className="bg-white rounded-2xl p-6 shadow mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Revenue by Vendor
                </h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50 text-gray-600">
                            <th className="p-3">Vendor Name</th>
                            <th className="p-3">Revenue (EGP)</th>
                            <th className="p-3">Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.revenueByVendor?.map((vendor) => (
                            <tr
                                key={vendor.vendorId}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="p-3">{vendor.vendorName}</td>
                                <td className="p-3 font-medium text-green-600">
                                    <CountUp end={vendor.revenue} duration={1.5} separator="," />
                                </td>
                                <td className="p-3">{vendor.orderCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Daily Revenue */}
            <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Daily Revenue
                </h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50 text-gray-600">
                            <th className="p-3">Date</th>
                            <th className="p-3">Revenue (EGP)</th>
                            <th className="p-3">Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.dailyRevenue?.map((day, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50 transition">
                                <td className="p-3">
                                    {new Date(day.date).toLocaleDateString()}
                                </td>
                                <td className="p-3 font-medium text-blue-600">
                                    <CountUp end={day.revenue} duration={1.5} separator="," />
                                </td>
                                <td className="p-3">{day.orderCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RevenueBreakdown;
