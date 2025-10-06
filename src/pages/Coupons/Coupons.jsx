// import { useEffect, useState } from "react";
// import { FaEdit, FaChartBar, FaPlus } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     ResponsiveContainer,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
// } from "recharts";

// const API_URL =
//     "https://api.maghni.acwad.tech/api/v1/coupons?status=active&page=1&limit=10&sortOrder=ASC";

// export default function Coupons() {
//     const [coupons, setCoupons] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showAnalytics, setShowAnalytics] = useState(false);
//     const [analyticsData, setAnalyticsData] = useState(null);

//     // تعديل
//     const [showEdit, setShowEdit] = useState(false);
//     const [editData, setEditData] = useState(null);

//     const token = localStorage.getItem("token");

//     // Fetch coupons
//     const fetchCoupons = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(API_URL, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const data = await res.json();
//             setCoupons(data.data.items || []);
//         } catch (err) {
//             toast.error("⚠️ Failed to load coupons!");
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchCoupons();
//     }, []);

//     // Handle analytics
//     const handleAnalytics = async (id, code) => {
//         try {
//             const res = await fetch(
//                 `https://api.maghni.acwad.tech/api/v1/coupons/${id}/analytics`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             const data = await res.json();
//             if (data.success) {
//                 setAnalyticsData({ ...data.data, code });
//                 setShowAnalytics(true);
//             } else {
//                 toast.error("⚠️ Failed to fetch analytics");
//             }
//         } catch (err) {
//             toast.error("❌ Error fetching analytics");
//         }
//     };

//     // Handle edit open
//     const openEditModal = (coupon) => {
//         setEditData(coupon);
//         setShowEdit(true);
//     };

//     // Handle edit save (PATCH)
//     const handleEditSave = async () => {
//         const body = {
//             code: editData.code || "",
//             name: editData.name || { en: "Default name" },   // لازم يكون object فيه نص
//             description: editData.description || { en: "Default description" },
//             discountType: editData.discountType || "percentage",
//             discountValue: editData.discountValue || 0,
//             maxDiscountAmount: editData.maxDiscountAmount || 0,
//             minOrderAmount: editData.minOrderAmount || 0,
//             status: editData.status || "active",
//             validFrom: editData.validFrom
//                 ? new Date(editData.validFrom).toISOString()
//                 : new Date().toISOString(),
//             validTo: editData.validTo
//                 ? new Date(editData.validTo).toISOString()
//                 : new Date().toISOString(),
//             usageLimit: editData.usageLimit || 0,
//             usageLimitPerUser: editData.usageLimitPerUser || 0,
//             applicableCategories: editData.applicableCategories || [],
//             applicableVendors: editData.applicableVendors || [],
//             applicableProducts: editData.applicableProducts || [],
//             excludedCategories: editData.excludedCategories || [],
//             excludedProducts: editData.excludedProducts || [],
//             applicableUserGroups: editData.applicableUserGroups || [],
//             isStackable:
//                 editData.isStackable !== undefined ? editData.isStackable : true,
//             createdBy: editData.createdBy || 0,
//             splitValue: editData.splitValue || 0,
//         };

//         try {
//             const res = await fetch(
//                 `https://api.maghni.acwad.tech/api/v1/coupons/${editData.id}`,
//                 {
//                     method: "PATCH",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify(body),
//                 }
//             );

//             const data = await res.json();
//             if (res.ok && data.success) {
//                 toast.success("✅ Coupon updated successfully");
//                 setShowEdit(false);
//                 fetchCoupons();
//             } else {
//                 toast.error("⚠️ " + (data.message || "Failed to update coupon"));
//                 console.error("PATCH error:", data);
//             }
//         } catch (err) {
//             toast.error("❌ Error updating coupon");
//             console.error(err);
//         }
//     };


//     const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <ToastContainer />
//             <h1 className="text-3xl font-extrabold text-gray-800 mb-6">🎟️ Coupons</h1>

//             {loading ? (
//                 <p className="text-center text-gray-600">Loading coupons...</p>
//             ) : (
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {coupons.map((coupon) => (
//                         <div
//                             key={coupon.id}
//                             className="bg-white rounded-2xl shadow-lg p-6 relative hover:shadow-2xl transition"
//                         >
//                             <h2 className="text-xl font-bold text-gray-800 mb-2">
//                                 {coupon.code}
//                             </h2>
//                             <p className="text-gray-600 text-sm">
//                                 {coupon.discountType} - {coupon.discountValue}
//                             </p>
//                             <div className="flex gap-4 mt-4 text-gray-500">
//                                 <FaEdit
//                                     className="cursor-pointer hover:text-blue-600"
//                                     onClick={() => openEditModal(coupon)}
//                                 />
//                                 <FaChartBar
//                                     className="cursor-pointer hover:text-green-600"
//                                     onClick={() => handleAnalytics(coupon.id, coupon.code)}
//                                 />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Modal Edit */}
//             {showEdit && editData && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
//                         <h2 className="text-2xl font-bold mb-4">✏️ Edit Coupon</h2>

//                         {/* Code */}
//                         <label className="block mb-2 text-sm font-medium">Code</label>
//                         <input
//                             type="text"
//                             value={editData.code}
//                             onChange={(e) => setEditData({ ...editData, code: e.target.value })}
//                             className="w-full border rounded px-3 py-2 mb-4"
//                         />

//                         {/* Name */}
//                         <div className="grid grid-cols-2 gap-4 mb-4">
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Name (EN)</label>
//                                 <input
//                                     type="text"
//                                     value={editData.name?.en || ""}
//                                     onChange={(e) =>
//                                         setEditData({
//                                             ...editData,
//                                             name: { ...editData.name, en: e.target.value },
//                                         })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Name (AR)</label>
//                                 <input
//                                     type="text"
//                                     value={editData.name?.ar || ""}
//                                     onChange={(e) =>
//                                         setEditData({
//                                             ...editData,
//                                             name: { ...editData.name, ar: e.target.value },
//                                         })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                         </div>

//                         {/* Description */}
//                         <div className="grid grid-cols-2 gap-4 mb-4">
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Description (EN)</label>
//                                 <textarea
//                                     value={editData.description?.en || ""}
//                                     onChange={(e) =>
//                                         setEditData({
//                                             ...editData,
//                                             description: { ...editData.description, en: e.target.value },
//                                         })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Description (AR)</label>
//                                 <textarea
//                                     value={editData.description?.ar || ""}
//                                     onChange={(e) =>
//                                         setEditData({
//                                             ...editData,
//                                             description: { ...editData.description, ar: e.target.value },
//                                         })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                         </div>

//                         {/* Discount fields */}
//                         <div className="grid grid-cols-2 gap-4 mb-4">
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Discount Type</label>
//                                 <select
//                                     value={editData.discountType}
//                                     onChange={(e) =>
//                                         setEditData({ ...editData, discountType: e.target.value })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 >
//                                     <option value="percentage">Percentage</option>
//                                     <option value="fixed">Fixed</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Discount Value</label>
//                                 <input
//                                     type="number"
//                                     value={editData.discountValue}
//                                     onChange={(e) =>
//                                         setEditData({ ...editData, discountValue: Number(e.target.value) })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                         </div>

//                         {/* Other numeric fields */}
//                         <div className="grid grid-cols-2 gap-4 mb-4">
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Max Discount</label>
//                                 <input
//                                     type="number"
//                                     value={editData.maxDiscountAmount}
//                                     onChange={(e) =>
//                                         setEditData({
//                                             ...editData,
//                                             maxDiscountAmount: Number(e.target.value),
//                                         })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Min Order Amount</label>
//                                 <input
//                                     type="number"
//                                     value={editData.minOrderAmount}
//                                     onChange={(e) =>
//                                         setEditData({
//                                             ...editData,
//                                             minOrderAmount: Number(e.target.value),
//                                         })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                         </div>

//                         {/* Status + Dates */}
//                         <div className="grid grid-cols-2 gap-4 mb-4">
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Status</label>
//                                 <select
//                                     value={editData.status}
//                                     onChange={(e) => setEditData({ ...editData, status: e.target.value })}
//                                     className="w-full border rounded px-3 py-2"
//                                 >
//                                     <option value="active">Active</option>
//                                     <option value="inactive">Inactive</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Is Stackable</label>
//                                 <input
//                                     type="checkbox"
//                                     checked={editData.isStackable}
//                                     onChange={(e) =>
//                                         setEditData({ ...editData, isStackable: e.target.checked })
//                                     }
//                                     className="ml-2"
//                                 />
//                             </div>
//                         </div>

//                         {/* Dates */}
//                         <div className="grid grid-cols-2 gap-4 mb-4">
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Valid From</label>
//                                 <input
//                                     type="datetime-local"
//                                     value={editData.validFrom?.slice(0, 16) || ""}
//                                     onChange={(e) =>
//                                         setEditData({ ...editData, validFrom: e.target.value })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Valid To</label>
//                                 <input
//                                     type="datetime-local"
//                                     value={editData.validTo?.slice(0, 16) || ""}
//                                     onChange={(e) =>
//                                         setEditData({ ...editData, validTo: e.target.value })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                         </div>

//                         {/* Usage Limits */}
//                         <div className="grid grid-cols-2 gap-4 mb-6">
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Usage Limit</label>
//                                 <input
//                                     type="number"
//                                     value={editData.usageLimit}
//                                     onChange={(e) =>
//                                         setEditData({ ...editData, usageLimit: Number(e.target.value) })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium">Usage Limit/User</label>
//                                 <input
//                                     type="number"
//                                     value={editData.usageLimitPerUser}
//                                     onChange={(e) =>
//                                         setEditData({
//                                             ...editData,
//                                             usageLimitPerUser: Number(e.target.value),
//                                         })
//                                     }
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>
//                         </div>

//                         {/* Buttons */}
//                         <div className="flex justify-end gap-4">
//                             <button
//                                 onClick={() => setShowEdit(false)}
//                                 className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleEditSave}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}


//             {/* Modal Analytics */}
//             {showAnalytics && analyticsData && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
//                     <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6">
//                         <h2 className="text-2xl font-bold mb-4">
//                             📊 Analytics - {analyticsData.code}
//                         </h2>

//                         {/* Stats Cards */}
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                             <div className="p-4 bg-blue-50 rounded-lg shadow text-center">
//                                 <p className="text-sm text-gray-600">Total Uses</p>
//                                 <p className="text-xl font-bold text-blue-700">
//                                     {analyticsData.analytics.totalUses}
//                                 </p>
//                             </div>
//                             <div className="p-4 bg-green-50 rounded-lg shadow text-center">
//                                 <p className="text-sm text-gray-600">Total Discount</p>
//                                 <p className="text-xl font-bold text-green-700">
//                                     {analyticsData.analytics.totalDiscount}
//                                 </p>
//                             </div>
//                             <div className="p-4 bg-yellow-50 rounded-lg shadow text-center">
//                                 <p className="text-sm text-gray-600">Avg Order</p>
//                                 <p className="text-xl font-bold text-yellow-700">
//                                     {analyticsData.analytics.avgOrderTotal}
//                                 </p>
//                             </div>
//                             <div className="p-4 bg-purple-50 rounded-lg shadow text-center">
//                                 <p className="text-sm text-gray-600">Unique Users</p>
//                                 <p className="text-xl font-bold text-purple-700">
//                                     {analyticsData.analytics.uniqueUsers}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Charts */}
//                         <div className="grid md:grid-cols-2 gap-6">
//                             {/* PieChart */}
//                             <div className="h-64">
//                                 <ResponsiveContainer>
//                                     <PieChart>
//                                         <Pie
//                                             data={[
//                                                 {
//                                                     name: "Uses",
//                                                     value: analyticsData.analytics.totalUses,
//                                                 },
//                                                 {
//                                                     name: "Unique Users",
//                                                     value: analyticsData.analytics.uniqueUsers,
//                                                 },
//                                             ]}
//                                             cx="50%"
//                                             cy="50%"
//                                             outerRadius={80}
//                                             fill="#8884d8"
//                                             dataKey="value"
//                                             label
//                                         >
//                                             {[
//                                                 analyticsData.analytics.totalUses,
//                                                 analyticsData.analytics.uniqueUsers,
//                                             ].map((entry, index) => (
//                                                 <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                                             ))}
//                                         </Pie>
//                                         <Tooltip />
//                                     </PieChart>
//                                 </ResponsiveContainer>
//                             </div>

//                             {/* BarChart */}
//                             <div className="h-64">
//                                 <ResponsiveContainer>
//                                     <BarChart
//                                         data={[
//                                             {
//                                                 name: "Total Uses",
//                                                 value: analyticsData.analytics.totalUses,
//                                             },
//                                             {
//                                                 name: "Unique Users",
//                                                 value: analyticsData.analytics.uniqueUsers,
//                                             },
//                                             {
//                                                 name: "Total Discount",
//                                                 value: analyticsData.analytics.totalDiscount,
//                                             },
//                                         ]}
//                                     >
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="name" />
//                                         <YAxis />
//                                         <Tooltip />
//                                         <Bar dataKey="value" fill="#82ca9d" />
//                                     </BarChart>
//                                 </ResponsiveContainer>
//                             </div>
//                         </div>

//                         <button
//                             onClick={() => setShowAnalytics(false)}
//                             className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { FaEdit, FaChartBar, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const API_URL =
    "https://api.maghni.acwad.tech/api/v1/coupons?status=active&page=1&limit=10&sortOrder=ASC";

export default function Coupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [analyticsData, setAnalyticsData] = useState(null);

    // تعديل
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);

    // إضافة
    const [showAdd, setShowAdd] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
        discountType: "percentage",
        discountValue: 0,
        maxDiscountAmount: 0,
        minOrderAmount: 0,
        status: "active",
        validFrom: "",
        validTo: "",
        usageLimit: 0,
        usageLimitPerUser: 0,
        applicableCategories: [],
        applicableVendors: [],
        applicableProducts: [],
        excludedCategories: [],
        excludedProducts: [],
        applicableUserGroups: [],
        isStackable: true,
        createdBy: 0,
        splitValue: 0,
    });

    const token = localStorage.getItem("token");

    // Fetch coupons
    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setCoupons(data.data.items || []);
        } catch (err) {
            toast.error("⚠️ Failed to load coupons!");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    // Handle analytics
    const handleAnalytics = async (id, code) => {
        try {
            const res = await fetch(
                `https://api.maghni.acwad.tech/api/v1/coupons/${id}/analytics`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.success) {
                setAnalyticsData({ ...data.data, code });
                setShowAnalytics(true);
            } else {
                toast.error("⚠️ Failed to fetch analytics");
            }
        } catch (err) {
            toast.error("❌ Error fetching analytics");
        }
    };

    // Handle edit open
    const openEditModal = (coupon) => {
        setEditData(coupon);
        setShowEdit(true);
    };

    // Handle edit save (PATCH)
    const handleEditSave = async () => {
        const body = {
            code: editData.code || "",
            name: editData.name || { en: "Default name" },
            description: editData.description || { en: "Default description" },
            discountType: editData.discountType || "percentage",
            discountValue: editData.discountValue || 0,
            maxDiscountAmount: editData.maxDiscountAmount || 0,
            minOrderAmount: editData.minOrderAmount || 0,
            status: editData.status || "active",
            validFrom: editData.validFrom
                ? new Date(editData.validFrom).toISOString()
                : new Date().toISOString(),
            validTo: editData.validTo
                ? new Date(editData.validTo).toISOString()
                : new Date().toISOString(),
            usageLimit: editData.usageLimit || 0,
            usageLimitPerUser: editData.usageLimitPerUser || 0,
            applicableCategories: editData.applicableCategories || [],
            applicableVendors: editData.applicableVendors || [],
            applicableProducts: editData.applicableProducts || [],
            excludedCategories: editData.excludedCategories || [],
            excludedProducts: editData.excludedProducts || [],
            applicableUserGroups: editData.applicableUserGroups || [],
            isStackable:
                editData.isStackable !== undefined ? editData.isStackable : true,
            createdBy: editData.createdBy || 0,
            splitValue: editData.splitValue || 0,
        };

        try {
            const res = await fetch(
                `https://api.maghni.acwad.tech/api/v1/coupons/${editData.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("✅ Coupon updated successfully");
                setShowEdit(false);
                fetchCoupons();
            } else {
                toast.error("⚠️ " + (data.message || "Failed to update coupon"));
                console.error("PATCH error:", data);
            }
        } catch (err) {
            toast.error("❌ Error updating coupon");
            console.error(err);
        }
    };

    // Handle add save (POST)
    const handleAddSave = async () => {
        const body = {
            ...newCoupon,
            validFrom: newCoupon.validFrom
                ? new Date(newCoupon.validFrom).toISOString()
                : new Date().toISOString(),
            validTo: newCoupon.validTo
                ? new Date(newCoupon.validTo).toISOString()
                : new Date().toISOString(),
        };

        try {
            const res = await fetch(
                `https://api.maghni.acwad.tech/api/v1/coupons`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("✅ Coupon added successfully");
                setShowAdd(false);
                fetchCoupons();
            } else {
                toast.error("⚠️ " + (data.message || "Failed to add coupon"));
                console.error("POST error:", data);
            }
        } catch (err) {
            toast.error("❌ Error adding coupon");
            console.error(err);
        }
    };

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800">🎟️ Coupons</h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    <FaPlus /> Add Coupon
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-600">Loading coupons...</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div
                            key={coupon.id}
                            className="bg-white rounded-2xl shadow-lg p-6 relative hover:shadow-2xl transition"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                {coupon.code}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {coupon.discountType} - {coupon.discountValue}
                            </p>
                            <div className="flex gap-4 mt-4 text-gray-500">
                                <FaEdit
                                    className="cursor-pointer hover:text-blue-600"
                                    onClick={() => openEditModal(coupon)}
                                />
                                <FaChartBar
                                    className="cursor-pointer hover:text-green-600"
                                    onClick={() => handleAnalytics(coupon.id, coupon.code)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Add */}
            {showAdd && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">➕ Add Coupon</h2>

                        {/* Code */}
                        <label className="block mb-2 text-sm font-medium">Code</label>
                        <input
                            type="text"
                            value={newCoupon.code}
                            onChange={(e) =>
                                setNewCoupon({ ...newCoupon, code: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 mb-4"
                        />

                        {/* Name */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Name (EN)</label>
                                <input
                                    type="text"
                                    value={newCoupon.name.en}
                                    onChange={(e) =>
                                        setNewCoupon({
                                            ...newCoupon,
                                            name: { ...newCoupon.name, en: e.target.value },
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Name (AR)</label>
                                <input
                                    type="text"
                                    value={newCoupon.name.ar}
                                    onChange={(e) =>
                                        setNewCoupon({
                                            ...newCoupon,
                                            name: { ...newCoupon.name, ar: e.target.value },
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Description (EN)</label>
                                <textarea
                                    value={newCoupon.description.en}
                                    onChange={(e) =>
                                        setNewCoupon({
                                            ...newCoupon,
                                            description: { ...newCoupon.description, en: e.target.value },
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Description (AR)</label>
                                <textarea
                                    value={newCoupon.description.ar}
                                    onChange={(e) =>
                                        setNewCoupon({
                                            ...newCoupon,
                                            description: { ...newCoupon.description, ar: e.target.value },
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Discount */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Discount Type</label>
                                <select
                                    value={newCoupon.discountType}
                                    onChange={(e) =>
                                        setNewCoupon({ ...newCoupon, discountType: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed_amount">Fixed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Discount Value</label>
                                <input
                                    type="number"
                                    value={newCoupon.discountValue}
                                    onChange={(e) =>
                                        setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Status + Dates */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Status</label>
                                <select
                                    value={newCoupon.status}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, status: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Is Stackable</label>
                                <input
                                    type="checkbox"
                                    checked={newCoupon.isStackable}
                                    onChange={(e) =>
                                        setNewCoupon({ ...newCoupon, isStackable: e.target.checked })
                                    }
                                    className="ml-2"
                                />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Valid From</label>
                                <input
                                    type="datetime-local"
                                    value={newCoupon.validFrom}
                                    onChange={(e) =>
                                        setNewCoupon({ ...newCoupon, validFrom: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Valid To</label>
                                <input
                                    type="datetime-local"
                                    value={newCoupon.validTo}
                                    onChange={(e) =>
                                        setNewCoupon({ ...newCoupon, validTo: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowAdd(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSave}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit */}
            {showEdit && editData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">✏️ Edit Coupon</h2>

                        {/* Code */}
                        <label className="block mb-2 text-sm font-medium">Code</label>
                        <input
                            type="text"
                            value={editData.code}
                            onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                            className="w-full border rounded px-3 py-2 mb-4"
                        />

                        {/* Name */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Name (EN)</label>
                                <input
                                    type="text"
                                    value={editData.name?.en || ""}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            name: { ...editData.name, en: e.target.value },
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Name (AR)</label>
                                <input
                                    type="text"
                                    value={editData.name?.ar || ""}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            name: { ...editData.name, ar: e.target.value },
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Description (EN)</label>
                                <textarea
                                    value={editData.description?.en || ""}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            description: { ...editData.description, en: e.target.value },
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Description (AR)</label>
                                <textarea
                                    value={editData.description?.ar || ""}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            description: { ...editData.description, ar: e.target.value },
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Discount fields */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Discount Type</label>
                                <select
                                    value={editData.discountType}
                                    onChange={(e) =>
                                        setEditData({ ...editData, discountType: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed_amount">Fixed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Discount Value</label>
                                <input
                                    type="number"
                                    value={editData.discountValue}
                                    onChange={(e) =>
                                        setEditData({ ...editData, discountValue: Number(e.target.value) })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Other numeric fields */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Max Discount</label>
                                <input
                                    type="number"
                                    value={editData.maxDiscountAmount}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            maxDiscountAmount: Number(e.target.value),
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Min Order Amount</label>
                                <input
                                    type="number"
                                    value={editData.minOrderAmount}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            minOrderAmount: Number(e.target.value),
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Status + Dates */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Status</label>
                                <select
                                    value={editData.status}
                                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Is Stackable</label>
                                <input
                                    type="checkbox"
                                    checked={editData.isStackable}
                                    onChange={(e) =>
                                        setEditData({ ...editData, isStackable: e.target.checked })
                                    }
                                    className="ml-2"
                                />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Valid From</label>
                                <input
                                    type="datetime-local"
                                    value={editData.validFrom?.slice(0, 16) || ""}
                                    onChange={(e) =>
                                        setEditData({ ...editData, validFrom: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Valid To</label>
                                <input
                                    type="datetime-local"
                                    value={editData.validTo?.slice(0, 16) || ""}
                                    onChange={(e) =>
                                        setEditData({ ...editData, validTo: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Usage Limits */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Usage Limit</label>
                                <input
                                    type="number"
                                    value={editData.usageLimit}
                                    onChange={(e) =>
                                        setEditData({ ...editData, usageLimit: Number(e.target.value) })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Usage Limit/User</label>
                                <input
                                    type="number"
                                    value={editData.usageLimitPerUser}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            usageLimitPerUser: Number(e.target.value),
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowEdit(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal Analytics */}
            {showAnalytics && analyticsData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            📊 Analytics - {analyticsData.code}
                        </h2>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-blue-50 rounded-lg shadow text-center">
                                <p className="text-sm text-gray-600">Total Uses</p>
                                <p className="text-xl font-bold text-blue-700">
                                    {analyticsData.analytics.totalUses}
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg shadow text-center">
                                <p className="text-sm text-gray-600">Total Discount</p>
                                <p className="text-xl font-bold text-green-700">
                                    {analyticsData.analytics.totalDiscount}
                                </p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg shadow text-center">
                                <p className="text-sm text-gray-600">Avg Order</p>
                                <p className="text-xl font-bold text-yellow-700">
                                    {analyticsData.analytics.avgOrderTotal}
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg shadow text-center">
                                <p className="text-sm text-gray-600">Unique Users</p>
                                <p className="text-xl font-bold text-purple-700">
                                    {analyticsData.analytics.uniqueUsers}
                                </p>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* PieChart */}
                            <div className="h-64">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {
                                                    name: "Uses",
                                                    value: analyticsData.analytics.totalUses,
                                                },
                                                {
                                                    name: "Unique Users",
                                                    value: analyticsData.analytics.uniqueUsers,
                                                },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label
                                        >
                                            {[
                                                analyticsData.analytics.totalUses,
                                                analyticsData.analytics.uniqueUsers,
                                            ].map((entry, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* BarChart */}
                            <div className="h-64">
                                <ResponsiveContainer>
                                    <BarChart
                                        data={[
                                            {
                                                name: "Total Uses",
                                                value: analyticsData.analytics.totalUses,
                                            },
                                            {
                                                name: "Unique Users",
                                                value: analyticsData.analytics.uniqueUsers,
                                            },
                                            {
                                                name: "Total Discount",
                                                value: analyticsData.analytics.totalDiscount,
                                            },
                                        ]}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowAnalytics(false)}
                            className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
