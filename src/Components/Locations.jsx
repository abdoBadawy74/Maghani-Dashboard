import { useEffect, useState } from "react";
import axios from "axios";
import { MoonLoader } from "react-spinners";

export default function Locations() {
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(100);
    const [loading, setLoading] = useState(true);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://api.maghni.acwad.tech/api/v1/vendor/dashboard/locations?limit=${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
            );
            setData(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, [limit]);

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Vendor Locations</h2>

                <div className="flex items-center gap-2">
                    <label className="text-gray-600">Limit:</label>
                    <input
                        type="number"
                        value={limit}
                        min="1"
                        className="border px-3 py-1 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setLimit(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <MoonLoader color="#3B82F6" />
                </div>
            ) : data.length === 0 ? (
                <p className="text-gray-500 text-center">No locations available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-left">#</th>
                                <th className="border p-2 text-left">Vendor Name</th>
                                <th className="border p-2 text-left">Latitude</th>
                                <th className="border p-2 text-left">Longitude</th>
                                <th className="border p-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((vendor, index) => (
                                <tr key={vendor.id}>
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="border p-2">{vendor.name}</td>
                                    <td className="border p-2">{vendor.latitude}</td>
                                    <td className="border p-2">{vendor.longitude}</td>
                                    <td
                                        className={`border p-2 font-semibold ${vendor.isOpen ? "text-green-600" : "text-red-500"
                                            }`}
                                    >
                                        {vendor.isOpen ? "Open" : "Closed"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
