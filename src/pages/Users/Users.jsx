import { useEffect, useState } from "react";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://api.maghni.acwad.tech/api/v1/user?keyword=${keyword}&page=${page}&limit=${limit}&sortOrder=ASC`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(res.data.data.items || []);
            setTotalPages(res.data.data.metadata.totalPages || 1);
        } catch (err) {
            toast.error("❌ Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async (id) => {
        try {
            const res = await axios.get(`https://api.maghni.acwad.tech/api/v1/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSelectedUser(res.data.data);
            setModalOpen(true);
            toast.success("✅ User details loaded");
        } catch {
            toast.error("❌ Failed to fetch user details");
        }
    };

    const toggleBlock = async (id) => {
        try {
            const res = await axios.patch(
                `https://api.maghni.acwad.tech/api/v1/user/${id}/toggle-block`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("🔄 " + res.data.message);
            fetchUsers();
        } catch {
            toast.error("❌ Failed to toggle block status");
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`https://api.maghni.acwad.tech/api/v1/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("🗑️ User deleted successfully");
            fetchUsers();
        } catch {
            toast.error("❌ Failed to delete user");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer position="top-right" autoClose={2000} />
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Users Management</h2>


            {/* Search & Limit */}
            <form onSubmit={handleSearch} className="mb-6 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search by keyword..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    Search
                </button>

                <div className="flex items-center gap-2">
                    <label className="text-gray-700 font-medium">Limit:</label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={limit}
                        onChange={(e) => {
                            const newLimit = Number(e.target.value);
                            setLimit(newLimit > 0 ? newLimit : 1);
                            setPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-20"
                    />
                </div>

                <Link to="/users/growth-trend" className="ml-auto bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
                    View Growth Trend
                </Link>
            </form>


            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <PulseLoader color="#2563eb" size={12} />
                </div>
            ) : users.length === 0 ? (
                <div className="text-center text-red-500">No users found.</div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Full Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3">{(page - 1) * limit + idx + 1}</td>
                                    <td className="p-3 font-medium">{user.fullName}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3 capitalize">{user.role}</td>
                                    <td
                                        className={`p-3 font-semibold ${user.status === "blocked"
                                            ? "text-red-600"
                                            : "text-green-600"
                                            }`}
                                    >
                                        {user.status}
                                    </td>
                                    <td className="p-3 flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => fetchUserDetails(user.id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => toggleBlock(user.id)}
                                            className={`${user.status === "blocked"
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-yellow-500 hover:bg-yellow-600"
                                                } text-white px-3 py-1 rounded-lg text-sm`}
                                        >
                                            {user.status === "blocked" ? "Unblock" : "Block"}
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 gap-3">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${page === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Previous
                </button>
                <span className="text-gray-700 font-medium">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg ${page === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Next
                </button>
            </div>

            {/* User Details Modal */}
            {modalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
                        >
                            ✖
                        </button>

                        <div className="flex items-center gap-4 mb-4 border-b pb-3">
                            <img
                                src={selectedUser.profileImage || "https://via.placeholder.com/100"}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border"
                            />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{selectedUser.fullName}</h3>
                                <p className="text-gray-600">{selectedUser.email}</p>
                                <p className="text-sm text-gray-500">Role: {selectedUser.role}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-gray-700">
                            <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                            <p><strong>Gender:</strong> {selectedUser.gender}</p>
                            <p><strong>Status:</strong> {selectedUser.status}</p>
                            <p><strong>Email Verified:</strong> {selectedUser.isEmailVerified ? "Yes" : "No"}</p>
                            <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                            <p><strong>Last Login:</strong> {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : "N/A"}</p>
                        </div>

                        {selectedUser.vendor && (
                            <div className="mt-6 border-t pt-3">
                                <h4 className="text-lg font-semibold mb-2 text-gray-800">Vendor Details</h4>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={selectedUser.vendor.logo}
                                        alt="Vendor Logo"
                                        className="w-16 h-16 rounded object-cover border"
                                    />
                                    <div>
                                        <p><strong>Name:</strong> {selectedUser.vendor.name}</p>
                                        <p><strong>Country:</strong> {selectedUser.vendor.country.name}</p>
                                        <p><strong>Category:</strong> {selectedUser.vendor.publicCategory.name.ar}</p>
                                        <p><strong>Delivery Fee:</strong> {selectedUser.vendor.deliveryFee} EGP</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
