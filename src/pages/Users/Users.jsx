import { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader, PulseLoader } from "react-spinners";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://api.maghni.acwad.tech/api/v1/user?keyword=${keyword}&page=${page}&limit=${limit}&sortOrder=ASC`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setUsers(res.data.data.items || []);
            setTotalPages(res.data.data.metadata.totalPages || 1);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Users List</h2>

            {/* Search & Limit Controls */}
            <form
                onSubmit={handleSearch}
                className="mb-6 flex flex-wrap items-center gap-3"
            >
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

                {/* Limit Input */}
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
            </form>

            {/* Table or Loader */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <ClipLoader color="#2563eb" size={60} />
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
                                <th className="p-3">Phone</th>
                                <th className="p-3">Gender</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Email Verified</th>
                                <th className="p-3">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => (
                                <tr
                                    key={user.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-3">{(page - 1) * limit + idx + 1}</td>
                                    <td className="p-3 font-medium">{user.fullName}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.phoneNumber}</td>
                                    <td className="p-3 capitalize">{user.gender}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3">
                                        {user.isEmailVerified ? (
                                            <span className="text-green-600 font-semibold">Yes</span>
                                        ) : (
                                            <span className="text-red-600 font-semibold">No</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
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
        </div>
    );
}
