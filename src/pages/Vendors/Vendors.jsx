import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    // ---------------- FETCH ALL VENDORS ----------------
    const fetchVendors = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                "https://api.maghni.acwad.tech/api/v1/vendor?page=1&limit=10&sortOrder=ASC",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                setVendors(data.data.items);
            } else {
                toast.error(data.message || "Failed to fetch vendors");
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Error loading vendors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    // ---------------- DELETE VENDOR ----------------
    const deleteVendor = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vendor?")) return;
        try {
            const res = await fetch(
                `https://api.maghni.acwad.tech/api/v1/vendor/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("🗑️ Vendor deleted successfully");
                fetchVendors();
            } else {
                toast.error(data.message || "Failed to delete vendor");
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Error deleting vendor");
        }
    };

    // ---------------- TOGGLE BLOCK ----------------
    const toggleBlock = async (id) => {
        try {
            const res = await fetch(
                `https://api.maghni.acwad.tech/api/v1/vendor/${id}/toggle-block`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            console.log(res);
            if (res.ok) {
                toast.success("🔄 Vendor block status updated");
                fetchVendors();
            } else {
                toast.error(data.message || "Failed to toggle block");
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Error toggling block status");
        }
    };

    // ---------------- TOGGLE STATUS ----------------
    const toggleStatus = async (id) => {
        try {
            const res = await fetch(
                `https://api.maghni.acwad.tech/api/v1/vendor/${id}/toggle-status`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            if (res.ok) {
                toast.success("✅ Vendor open/close status updated");
                fetchVendors();
            } else {
                toast.error(data.message || "Failed to toggle status");
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Error toggling open/close status");
        }
    };

    // ---------------- UI ----------------
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <ToastContainer />
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">🏪 Vendors</h1>
              <Link
                  to="/vendors/overview"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                  Go to Overview
              </Link>
          </div>
            {loading ? (
                <p className="text-center text-lg">Loading vendors...</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full border">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border">#</th>
                                <th className="p-2 border">Logo</th>
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Category</th>
                                <th className="p-2 border">Country</th>
                                <th className="p-2 border">Rate</th>
                                <th className="p-2 border">Orders</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Blocked</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((vendor, index) => (
                                <tr key={vendor.id} className="text-center">
                                    <td className="p-2 border">{index + 1}</td>
                                    <td className="p-2 border">
                                        <img
                                            src={vendor.logo}
                                            alt="logo"
                                            className="w-12 h-12 rounded-full mx-auto"
                                        />
                                    </td>
                                    <td className="p-2 border font-semibold">{vendor.name}</td>
                                    <td className="p-2 border">
                                        {vendor.publicCategory?.name || "—"}
                                    </td>
                                    <td className="p-2 border">{vendor.country?.name || "—"}</td>
                                    <td className="p-2 border">{vendor.rate}</td>
                                    <td className="p-2 border">{vendor.orderCount}</td>

                                    {/* Status */}
                                    <td className="p-2 border">
                                        <span
                                            className={`px-2 py-1 rounded text-white ${vendor.isOpen ? "bg-green-600" : "bg-gray-600"
                                                }`}
                                        >
                                            {vendor.isOpen ? "Open" : "Closed"}
                                        </span>
                                    </td>

                                    {/* Blocked */}
                                    <td className="p-2 border">
                                        <span
                                            className={`px-2 py-1 rounded text-white ${vendor.isBlocked ? "bg-red-600" : "bg-blue-600"
                                                }`}
                                        >
                                            {vendor.isBlocked ? "Blocked" : "Active"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-2 border flex flex-wrap justify-center gap-2">
                                        <button
                                            onClick={() => toggleStatus(vendor.id)}
                                            className={`px-3 py-1 rounded text-white ${vendor.isOpen ? "bg-gray-700" : "bg-green-700"
                                                }`}
                                        >
                                            {vendor.isOpen ? "Close" : "Open"}
                                        </button>

                                        <button
                                            onClick={() => toggleBlock(vendor.id)}
                                            className={`px-3 py-1 rounded text-white ${vendor.isBlocked ? "bg-yellow-600" : "bg-red-600"
                                                }`}
                                        >
                                            {vendor.isBlocked ? "Unblock" : "Block"}
                                        </button>

                                        <button
                                            onClick={() => deleteVendor(vendor.id)}
                                            className="px-3 py-1 bg-black text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {vendors.length === 0 && (
                                <tr>
                                    <td colSpan="10" className="p-4 text-center text-gray-500">
                                        No vendors found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
