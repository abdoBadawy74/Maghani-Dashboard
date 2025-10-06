import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://api.maghni.acwad.tech/api/v1/public-category";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add/Edit Modal
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ en: "", ar: "", image: null });
    const [selectedId, setSelectedId] = useState(null);

    const token = localStorage.getItem("token");

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setCategories(data.data || []);
        } catch (err) {
            toast.error("⚠️ Failed to load categories");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle Add/Edit submit
    const handleSave = async () => {
        if (!formData.en || !formData.ar || !formData.image) {
            toast.error("Please fill all fields (EN, AR, and Icon)");
            return;
        }

        const body = new FormData();
        body.append("name[en]", formData.en); // object structure
        body.append("name[ar]", formData.ar); // object structure
        body.append("icon", formData.image);  // file upload

        try {
            const res = await fetch(editMode ? `${API_URL}/${selectedId}` : API_URL, {
                method: editMode ? "PATCH" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // important: don't set Content-Type manually
                },
                body,
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success(editMode ? "✅ Category updated" : "✅ Category added");
                setShowModal(false);
                setFormData({ en: "", ar: "", image: null });
                fetchCategories();
            } else {
                console.log("Server Response:", data);
                toast.error("⚠️ " + (data.message || "Operation failed"));
            }
        } catch (err) {
            toast.error("❌ Error saving category");
        }
    };


    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("🗑️ Category deleted");
                fetchCategories();
            } else {
                toast.error("⚠️ " + (data.message || "Failed to delete"));
            }
        } catch (err) {
            toast.error("❌ Error deleting category");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800">📂 Categories</h1>
                <button
                    onClick={() => {
                        setEditMode(false);
                        setFormData({ en: "", ar: "", image: null });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <FaPlus /> Add Category
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-600">Loading categories...</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="bg-white rounded-2xl shadow-lg p-6 relative hover:shadow-2xl transition flex flex-col items-center"
                        >
                            <img
                                src={cat.icon}
                                alt={cat.name}
                                className="w-20 h-20 rounded-full object-cover mb-4"
                            />
                            <h2 className="text-lg font-bold text-gray-800">{cat.name}</h2>
                            <div className="flex gap-4 mt-4 text-gray-500">
                                <FaEdit
                                    className="cursor-pointer hover:text-blue-600"
                                    onClick={() => {
                                        setEditMode(true);
                                        setSelectedId(cat.id);
                                        setFormData({ en: cat.name, ar: cat.name, image: null });
                                        setShowModal(true);
                                    }}
                                />
                                <FaTrash
                                    className="cursor-pointer hover:text-red-600"
                                    onClick={() => handleDelete(cat.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {editMode ? "✏️ Edit Category" : "➕ Add Category"}
                        </h2>

                        <label className="block mb-2 text-sm font-medium">Name (EN)</label>
                        <input
                            type="text"
                            value={formData.en}
                            onChange={(e) => setFormData({ ...formData, en: e.target.value })}
                            className="w-full border rounded px-3 py-2 mb-4"
                        />

                        <label className="block mb-2 text-sm font-medium">Name (AR)</label>
                        <input
                            type="text"
                            value={formData.ar}
                            onChange={(e) => setFormData({ ...formData, ar: e.target.value })}
                            className="w-full border rounded px-3 py-2 mb-4"
                        />

                        <label className="block mb-2 text-sm font-medium">Icon (Image)</label>
                        <input
                            type="file"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            className="w-full border rounded px-3 py-2 mb-4"
                        />

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {editMode ? "Save Changes" : "Add Category"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
