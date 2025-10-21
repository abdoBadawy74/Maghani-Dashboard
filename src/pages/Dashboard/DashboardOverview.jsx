import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { PulseLoader } from "react-spinners";

const DashboardOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await axios.get(
                    "https://api.maghni.acwad.tech/api/v1/dashboard/overview/quick"
                );
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
    }, []);

    const cards = [
        {
            title: "Total Revenue",
            value: data?.totalRevenue,
            color: "bg-green-500",
            trend: data?.trends?.revenue,
            suffix: " EGP",
        },
        {
            title: "Total Orders",
            value: data?.totalOrders,
            color: "bg-blue-500",
            trend: data?.trends?.orders,
        },
        {
            title: "Total Users",
            value: data?.totalUsers,
            color: "bg-purple-500",
            trend: data?.trends?.users,
        },
        {
            title: "Average Order Value",
            value: data?.averageOrderValue,
            color: "bg-yellow-500",
            trend: data?.trends?.averageOrderValue,
            suffix: " EGP",
        },
    ];

    if (loading)
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <PulseLoader color="#4f46e5" size={15} />
            </div>
        );

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`${card.color} text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between`}
                >
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                        <p className="text-3xl font-bold">
                            <CountUp end={card.value || 0} duration={2.5} separator="," />
                            {card.suffix && <span className="text-sm ml-1">{card.suffix}</span>}
                        </p>
                    </div>
                    {card.trend && (
                        <div className="flex items-center mt-4">
                            {card.trend.direction === "up" ? (
                                <FaArrowUp className="text-white mr-2 animate-bounce" />
                            ) : (
                                <FaArrowDown className="text-white mr-2 animate-bounce" />
                            )}
                            <span className="text-sm">
                                {card.trend.change?.toFixed(2)}% from previous
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DashboardOverview;
