import React, { useEffect, useState } from "react";
import axios from "axios";
import { PulseLoader } from "react-spinners";

const RecentActivity = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("orders");

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await axios.get(
                    "https://api.maghni.acwad.tech/api/v1/dashboard/recent-activity"
                );
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <PulseLoader color="#4f46e5" size={15} />
            </div>
        );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Activity</h2>

            {/* Tabs */}
            <div className="flex gap-3 mb-6">
                {[
                    { key: "orders", label: "Recent Orders" },
                    { key: "users", label: "Recent Users" },
                    { key: "reviews", label: "Recent Reviews" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === tab.key
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tables */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {activeTab === "orders" && (
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Order #</th>
                                <th className="py-3 px-4 text-left">Customer</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Total</th>
                                <th className="py-3 px-4 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.recentOrders?.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{order.orderNumber}</td>
                                    <td className="py-3 px-4">{order.user?.fullName || "N/A"}</td>
                                    <td className="py-3 px-4 capitalize">{order.status}</td>
                                    <td className="py-3 px-4">{order.totalAmount} EGP</td>
                                    <td className="py-3 px-4">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === "users" && (
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-left">Email</th>
                                <th className="py-3 px-4 text-left">Vendor</th>
                                <th className="py-3 px-4 text-left">Date Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.recentUsers?.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{user.fullName || "N/A"}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">
                                        {user.vendor ? user.vendor.name : "-"}
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === "reviews" && (
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">User</th>
                                <th className="py-3 px-4 text-left">Rating</th>
                                <th className="py-3 px-4 text-left">Comment</th>
                                <th className="py-3 px-4 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.recentReviews?.map((review) => (
                                <tr key={review.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{review.user?.fullName}</td>
                                    <td className="py-3 px-4">{review.rating}</td>
                                    <td className="py-3 px-4">{review.comment}</td>
                                    <td className="py-3 px-4">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
