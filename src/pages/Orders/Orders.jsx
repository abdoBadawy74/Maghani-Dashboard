// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [stats, setStats] = useState({});
//   const [page, setPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loadingDetails, setLoadingDetails] = useState(false);

//   const token = localStorage.getItem("token");

//   // ✅ Get Orders
//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get(
//         `https://api.maghni.acwad.tech/api/v1/orders?page=${page}&limit=10`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setOrders(res.data.data.items);
//       setStats(res.data.data.statistics);
//     } catch (err) {
//       toast.error("❌ Failed to load orders");
//     }
//   };

//   // ✅ Update Order
//   const updateOrder = async (orderId, newStatus) => {
//     try {
//       const body = {
//         status: newStatus,
//         paymentStatus: "pending",
//         notes: "status updated from dashboard",
//       };

//       await axios.patch(
//         `https://api.maghni.acwad.tech/api/v1/orders/${orderId}`,
//         body,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("✅ Order updated successfully");
//       fetchOrders(); // refresh list
//     } catch (err) {
//       toast.error("❌ Failed to update order");
//     }
//   };

//   // ✅ Get Order Details
//   const fetchOrderDetails = async (orderId) => {
//     try {
//       setLoadingDetails(true);
//       setSelectedOrder({}); // يفتح المودال فاضي الأول
//       const res = await axios.get(
//         `https://api.maghni.acwad.tech/api/v1/orders/admin/${orderId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSelectedOrder(res.data);
//     } catch (err) {
//       toast.error("❌ Failed to load order details");
//       setSelectedOrder(null);
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [page]);

//   return (
//     <div className="p-4">
//       {/* Statistics */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="bg-white p-4 shadow rounded">
//           <h3 className="text-gray-500">Total Customers</h3>
//           <p className="text-xl font-bold">{stats.totalUniqueCustomers}</p>
//         </div>
//         <div className="bg-white p-4 shadow rounded">
//           <h3 className="text-gray-500">Total Sales</h3>
//           <p className="text-xl font-bold">{stats.totalSales} EGP</p>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white shadow rounded overflow-x-auto">
//         <table className="min-w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">Order No</th>
//               <th className="p-3 text-left">Customer</th>
//               <th className="p-3 text-left">Vendor</th>
//               <th className="p-3 text-left">Total</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order.id} className="border-b">
//                 <td className="p-3">{order.orderNumber}</td>
//                 <td className="p-3">{order.user?.fullName}</td>
//                 <td className="p-3 flex items-center gap-2">
//                   <img
//                     src={order.vendor?.logo}
//                     alt={order.vendor?.name}
//                     className="w-8 h-8 rounded-full"
//                   />
//                   {order.vendor?.name}
//                 </td>
//                 <td className="p-3">
//                   {order.totalAmount} {order.currency}
//                 </td>
//                 <td className="p-3">
//                   <span
//                     className={`px-2 py-1 rounded text-white 
//                     ${order.status === "pending"
//                         ? "bg-yellow-500"
//                         : order.status === "confirmed"
//                           ? "bg-blue-500"
//                           : order.status === "shipped"
//                             ? "bg-purple-500"
//                             : order.status === "delivered"
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                       }`}
//                   >
//                     {order.statusDescription}
//                   </span>
//                 </td>
//                 <td className="p-3 flex gap-2">
//                   {/* View Button */}
//                   <button
//                     className="text-blue-600 hover:underline"
//                     onClick={() => fetchOrderDetails(order.id)}
//                   >
//                     View
//                   </button>

//                   {/* Update Status */}
//                   {order.availableTransitions?.length > 0 && (
//                     <select
//                       className="border rounded px-2 py-1"
//                       onChange={(e) => updateOrder(order.id, e.target.value)}
//                       defaultValue=""
//                     >
//                       <option value="" disabled>
//                         Change Status
//                       </option>
//                       {order.availableTransitions.map((t) => (
//                         <option key={t} value={t}>
//                           {t}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center mt-6">
//         <button
//           onClick={() => setPage((p) => p - 1)}
//           disabled={page === 1}
//           className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span className="px-4 py-2">{page}</span>
//         <button
//           onClick={() => setPage((p) => p + 1)}
//           className="px-4 py-2 bg-gray-200 rounded"
//         >
//           Next
//         </button>
//       </div>

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
//           <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
//             {loadingDetails ? (
//               <p className="text-center">Loading...</p>
//             ) : (
//               <>
//                 <h2 className="text-2xl font-bold mb-4">
//                   Order #{selectedOrder.orderNumber}
//                 </h2>

//                 {/* Vendor Info */}
//                 <div className="mb-4 flex items-center gap-3">
//                   <img
//                     src={selectedOrder.vendor?.logo}
//                     alt={selectedOrder.vendor?.name}
//                     className="w-12 h-12 rounded-full"
//                   />
//                   <div>
//                     <h3 className="font-bold">{selectedOrder.vendor?.name}</h3>
//                     <p>Delivery Fee: {selectedOrder.vendor?.deliveryFee}</p>
//                   </div>
//                 </div>

//                 {/* Customer Info */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold text-lg mb-2">Customer Info</h3>
//                   <p>Name: {selectedOrder.user?.fullName}</p>
//                   <p>Email: {selectedOrder.user?.email}</p>
//                   <p>Phone: {selectedOrder.shippingAddress?.phone1}</p>
//                 </div>

//                 {/* Shipping Address */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
//                   <p>{selectedOrder.shippingAddress?.description}</p>
//                   <p>
//                     Lat: {selectedOrder.shippingAddress?.latitude}, Long:{" "}
//                     {selectedOrder.shippingAddress?.longitude}
//                   </p>
//                 </div>

//                 {/* Products */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold text-lg mb-2">Products</h3>
//                   {selectedOrder.orderItems?.map((item) => (
//                     <div
//                       key={item.id}
//                       className="border p-3 mb-2 rounded flex justify-between items-center"
//                     >
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={item.productImages[0]}
//                           alt={item.productName}
//                           className="w-16 h-16 object-cover rounded"
//                         />
//                         <div>
//                           <p className="font-bold">{item.productName}</p>
//                           <p className="text-sm text-gray-600">
//                             Qty: {item.quantity} × {item.unitPrice}{" "}
//                             {selectedOrder.currency}
//                           </p>
//                           {item.variant && (
//                             <p className="text-xs text-gray-500">
//                               Variant: {item.variant.name} ({item.variant.price}{" "}
//                               {selectedOrder.currency})
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       <p className="font-bold">
//                         {item.totalPrice} {selectedOrder.currency}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Notes */}
//                 {selectedOrder.notes && (
//                   <div className="mb-4">
//                     <h3 className="font-semibold text-lg mb-2">Notes</h3>
//                     <p>{selectedOrder.notes}</p>
//                   </div>
//                 )}

//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
//                 >
//                   Close
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Get Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `https://api.maghni.acwad.tech/api/v1/orders?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data.data.items);
      setStats(res.data.data.statistics);
    } catch (err) {
      toast.error("❌ Failed to load orders");
    }
  };

  // ✅ Update Order
  const updateOrder = async (orderId, newStatus) => {
    try {
      const body = {
        status: newStatus,
        paymentStatus: "pending",
        notes: "status updated from dashboard",
      };

      await axios.patch(
        `https://api.maghni.acwad.tech/api/v1/orders/${orderId}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Order updated successfully");
      fetchOrders();
    } catch (err) {
      toast.error("❌ Failed to update order");
    }
  };

  // ✅ Get Order Details
  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingDetails(true);
      setSelectedOrder({});
      const res = await axios.get(
        `https://api.maghni.acwad.tech/api/v1/orders/admin/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedOrder(res.data);
    } catch (err) {
      toast.error("❌ Failed to load order details");
      setSelectedOrder(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  return (
    <div className="p-4">
      <ToastContainer />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded flex justify-between items-center">
          <div>
            <h3 className="text-gray-500">Total Customers</h3>
            <p className="text-xl font-bold">{stats.totalUniqueCustomers}</p>
          </div>
          <div className="text-3xl text-blue-500">👥</div>
        </div>
        <div className="bg-white p-4 shadow rounded flex justify-between items-center">
          <div>
            <h3 className="text-gray-500">Total Sales</h3>
            <p className="text-xl font-bold">{stats.totalSales} EGP</p>
          </div>
          <div className="text-3xl text-green-500">💰</div>
        </div>
      </div>

      {/* Limit Input */}
      <div className="mb-4 flex items-center gap-2">
        <label>Orders per page:</label>
        <input
          type="number"
          min="1"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border rounded px-2 py-1 w-20"
        />
      </div>

      {/* Orders Cards */}
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">لا يوجد بيانات</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow rounded p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold">{order.orderNumber}</h4>
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${order.status === "pending"
                      ? "bg-yellow-500"
                      : order.status === "confirmed"
                        ? "bg-blue-500"
                        : order.status === "shipped"
                          ? "bg-purple-500"
                          : order.status === "delivered"
                            ? "bg-green-500"
                            : "bg-red-500"
                    }`}
                >
                  {order.statusDescription}
                </span>
              </div>

              <p className="text-gray-600">{order.user?.fullName}</p>
              <div className="flex items-center gap-2">
                <img
                  src={order.vendor?.logo}
                  alt={order.vendor?.name}
                  className="w-8 h-8 rounded-full"
                />
                <p>{order.vendor?.name}</p>
              </div>
              <p className="font-bold">{order.totalAmount} {order.currency}</p>

              <div className="flex gap-2 mt-2">
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => fetchOrderDetails(order.id)}
                >
                  View
                </button>
                {order.availableTransitions?.length > 0 && (
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    onChange={(e) => updateOrder(order.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Change Status</option>
                    {order.availableTransitions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {/* Order Details Modal (كما هو) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            {loadingDetails ? (
              <p className="text-center">Loading...</p>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  Order #{selectedOrder.orderNumber}
                </h2>
                {/* Vendor Info */}
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={selectedOrder.vendor?.logo}
                    alt={selectedOrder.vendor?.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">{selectedOrder.vendor?.name}</h3>
                    <p>Delivery Fee: {selectedOrder.vendor?.deliveryFee}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Customer Info</h3>
                  <p>Name: {selectedOrder.user?.fullName}</p>
                  <p>Email: {selectedOrder.user?.email}</p>
                  <p>Phone: {selectedOrder.shippingAddress?.phone1}</p>
                </div>

                {/* Shipping Address */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress?.description}</p>
                  <p>
                    Lat: {selectedOrder.shippingAddress?.latitude}, Long:{" "}
                    {selectedOrder.shippingAddress?.longitude}
                  </p>
                </div>

                {/* Products */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Products</h3>
                  {selectedOrder.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="border p-3 mb-2 rounded flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImages[0]}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-bold">{item.productName}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × {item.unitPrice}{" "}
                            {selectedOrder.currency}
                          </p>
                          {item.variant && (
                            <p className="text-xs text-gray-500">
                              Variant: {item.variant.name} ({item.variant.price}{" "}
                              {selectedOrder.currency})
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-bold">
                        {item.totalPrice} {selectedOrder.currency}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Notes</h3>
                    <p>{selectedOrder.notes}</p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
