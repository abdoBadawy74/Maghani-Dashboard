import { useState, useEffect } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { PulseLoader } from "react-spinners";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function VendorsPerformanceTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://api.maghni.acwad.tech/api/v1/dashboard/vendors/performance",
        {
          params: { startDate, endDate },
        }
      );
      setData(res.data);
    } catch (err) {
      console.error("Error fetching vendor performance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <PulseLoader color="#4f46e5" />
      </div>
    );

  if (!data)
    return (
      <p className="text-center text-gray-600">No vendor performance data.</p>
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vendors Performance</h2>

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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Load Data
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard title="Total Vendors" value={data.totalVendors} color="bg-blue-500" />
        <SummaryCard title="Active Vendors" value={data.activeVendors} color="bg-green-500" />
      </div>

      {/* Vendor Performance Chart */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3">Revenue by Vendor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.vendorPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vendorName" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} EGP`, "Revenue"]} />
            <Bar dataKey="totalRevenue" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vendor Performance Table */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <h3 className="font-semibold text-lg mb-3">Vendor Performance</h3>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Vendor Name</th>
              <th className="p-2 border">Orders</th>
              <th className="p-2 border">Total Revenue (EGP)</th>
              <th className="p-2 border">Avg Order Value (EGP)</th>
            </tr>
          </thead>
          <tbody>
            {data.vendorPerformance.map((v) => (
              <tr key={v.vendorId} className="border-b hover:bg-gray-50">
                <td className="p-2 border">{v.vendorName}</td>
                <td className="p-2 border">{v.orderCount}</td>
                <td className="p-2 border">{v.totalRevenue}</td>
                <td className="p-2 border">{v.averageOrderValue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vendor Ratings Table */}
      {data.vendorRatings?.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
          <h3 className="font-semibold text-lg mb-3">Vendor Ratings</h3>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Vendor Name</th>
                <th className="p-2 border">Average Rating</th>
                <th className="p-2 border">Review Count</th>
              </tr>
            </thead>
            <tbody>
              {data.vendorRatings.map((v) => (
                <tr key={v.vendorId} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{v.vendorName}</td>
                  <td className="p-2 border">{v.averageRating}</td>
                  <td className="p-2 border">{v.reviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`p-4 rounded-xl text-white shadow ${color}`}>
      <h4 className="text-sm uppercase opacity-80">{title}</h4>
      <p className="text-2xl font-bold mt-1">
        <CountUp end={value || 0} duration={2.5} separator="," />
      </p>
    </div>
  );
}
