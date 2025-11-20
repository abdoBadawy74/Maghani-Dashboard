import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const token = localStorage.getItem("token");

  // 📌 Contact Us State
  const [contact, setContact] = useState([]); // list of {type, value}
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newContact, setNewContact] = useState({ type: "", value: "" });


  // 📌 Help Center State
  const [helpCenter, setHelpCenter] = useState([]);
  const [newHelp, setNewHelp] = useState({ question: "", answer: "" });

  // 📌 Policies State
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({ title: "", content: "" });

  // ------------------ Fetch Data ------------------
  const fetchContact = async () => {
    const res = await fetch("https://api.maghni.acwad.tech/api/v1/setting/contact-us", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!data.success || !data.data) return;

    const obj = data.data;

    // تحويل الـ object إلى array [{type, value}]
    const arr = Object.keys(obj).map(key => ({
      type: key,
      value: obj[key]
    }));

    setContact(arr);
  };


  const fetchHelpCenter = async () => {
    const res = await fetch("https://api.maghni.acwad.tech/api/v1/setting/help-center", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setHelpCenter(data.data);
  };

  const fetchPolicies = async () => {
    const res = await fetch("https://api.maghni.acwad.tech/api/v1/setting/policies", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setPolicies(data.data);
  };

  useEffect(() => {
    fetchContact();
    fetchHelpCenter();
    fetchPolicies();
  }, []);

  // ------------------ Contact Us Update ------------------
  const updateContact = async () => {
    try {
      const res = await fetch("https://api.maghni.acwad.tech/api/v1/setting/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contact), // contact is array of {type, value}
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Contact info updated");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Error updating contact info");
    }
  };

  const deleteContact = (index) => {
    axios.delete(`https://api.maghni.acwad.tech/api/v1/setting/contact-us/${index}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        toast.success("Contact info deleted");
        fetchContact();
      })
      .catch(() => {
        toast.error("Error deleting contact info");
      });
  };

  // ------------------ Help Center ------------------
  const addHelp = async () => {
    if (!newHelp.question || !newHelp.answer) {
      toast.error("❌ Please fill in all fields");
      return;
    }
    try {
      const res = await fetch("https://api.maghni.acwad.tech/api/v1/setting/help-center", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHelp),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("✅ Added successfully");
        setNewHelp({ question: "", answer: "" });
        fetchHelpCenter();
      } else {
        toast.error(data.message || "Add failed");
      }
    } catch {
      toast.error("❌ Error adding help item");
    }
  };

  const deleteHelp = async (id) => {
    try {
      const res = await fetch(`https://api.maghni.acwad.tech/api/v1/setting/help-center/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("🗑️ Deleted successfully");
        fetchHelpCenter();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch {
      toast.error("❌ Error deleting help item");
    }
  };

  // ------------------ Policies ------------------
  const addPolicy = async () => {
    if (!newPolicy.title || !newPolicy.content) {
      toast.error("❌ Please fill in all fields");
      return;
    }
    try {
      const res = await fetch("https://api.maghni.acwad.tech/api/v1/setting/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPolicy),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("✅ Policy added");
        setNewPolicy({ title: "", content: "" });
        fetchPolicies();
      } else {
        toast.error(data.message || "Add failed");
      }
    } catch {
      toast.error("❌ Error adding policy");
    }
  };

  const deletePolicy = async (id) => {
    try {
      const res = await fetch(`https://api.maghni.acwad.tech/api/v1/setting/policies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("🗑️ Policy deleted");
        fetchPolicies();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch {
      toast.error("❌ Error deleting policy");
    }
  };

  // ------------------ UI ------------------
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">⚙️ Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-4 py-2 rounded-lg ${activeTab === "contact" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Contact Us
        </button>
        <button
          onClick={() => setActiveTab("help")}
          className={`px-4 py-2 rounded-lg ${activeTab === "help" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Help Center
        </button>
        <button
          onClick={() => setActiveTab("policies")}
          className={`px-4 py-2 rounded-lg ${activeTab === "policies" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Policies
        </button>
      </div>

      {/* ------------------ Contact Us ------------------ */}
      {/* {activeTab === "contact" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">📩 Contact Info</h2>
          <p className="mb-4 text-gray-600">Update the contact information displayed to users.</p>
          <div className="grid gap-4">
            <div className="flex flex-col">
              <label className="font-medium">Email:</label>
              <input
                type="email"
                placeholder="Email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="border px-3 py-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Phone:</label>
              <input
                type="text"
                placeholder="Phone"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="border px-3 py-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Whatsapp:</label>
              <input
                type="text"
                placeholder="Whatsapp"
                value={contact.whatsapp}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                className="border px-3 py-2 rounded"
              />
            </div>
          </div>
          <button
            onClick={updateContact}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      )} */}

      {/* ------------------ Contact Us ------------------ */}
      {activeTab === "contact" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">📩 Contact Info</h2>
          <p className="mb-4 text-gray-600">Manage contact information displayed to users.</p>

          {/* Contact List */}
          <div className="mb-4">
            {contact?.length === 0 && (
              <p className="text-gray-500">No contact info added yet.</p>
            )}

            {contact?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border rounded mb-2"
              >
                <div>
                  <span className="font-semibold capitalize">{item.type}: </span>
                  {item.value}
                </div>

                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => {
                    deleteContact(item.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Add New Button */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => setShowAddPopup(true)}
          >
            ➕ Add Contact
          </button>

          {/* Add Contact Popup */}
          {showAddPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h3 className="text-lg font-bold mb-4">Add Contact Info</h3>

                <label className="font-medium">Type:</label>
                <select
                  value={newContact.type}
                  onChange={(e) =>
                    setNewContact({ ...newContact, type: e.target.value })
                  }
                  className="border w-full p-2 rounded mb-3"
                >
                  <option value="">Select type</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">Whatsapp</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                  <option value="website">Website</option>
                </select>

                <label className="font-medium">Value:</label>
                <input
                  type="text"
                  placeholder="Enter value"
                  value={newContact.value}
                  onChange={(e) =>
                    setNewContact({ ...newContact, value: e.target.value })
                  }
                  className="border w-full p-2 rounded mb-4"
                />

                <div className="flex justify-end gap-3">
                  <button
                    className="px-3 py-2 bg-gray-400 rounded text-white"
                    onClick={() => {
                      setShowAddPopup(false);
                      setNewContact({ type: "", value: "" });
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="px-3 py-2 bg-blue-600 rounded text-white"
                    onClick={updateContact}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* ------------------ Help Center ------------------ */}
      {activeTab === "help" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">❓ Help Center</h2>
          <div className="grid gap-4 mb-4">
            <input
              type="text"
              placeholder="Question"
              required
              value={newHelp.question}
              onChange={(e) => setNewHelp({ ...newHelp, question: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <textarea
              placeholder="Answer"
              required
              value={newHelp.answer}
              onChange={(e) => setNewHelp({ ...newHelp, answer: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <button onClick={addHelp} className="bg-green-600 text-white px-4 py-2 rounded-lg">
              Add
            </button>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Question</th>
                <th className="p-2 border">Answer</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {helpCenter.map((h) => (
                <tr key={h.id}>
                  <td className="p-2 border">{h.id}</td>
                  <td className="p-2 border">{h.question}</td>
                  <td className="p-2 border">{h.answer}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => deleteHelp(h.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
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

      {/* ------------------ Policies ------------------ */}
      {activeTab === "policies" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">📜 Policies</h2>
          <div className="grid gap-4 mb-4">
            <input
              type="text"
              placeholder="Title"
              value={newPolicy.title}
              onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <textarea
              placeholder="Content"
              value={newPolicy.content}
              onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <button onClick={addPolicy} className="bg-green-600 text-white px-4 py-2 rounded-lg">
              Add
            </button>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Content</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 border">{p.id}</td>
                  <td className="p-2 border">{p.title}</td>
                  <td className="p-2 border">{p.content}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => deletePolicy(p.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
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
    </div>
  );
}
