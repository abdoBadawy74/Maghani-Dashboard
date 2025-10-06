import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const token = localStorage.getItem("token");

  // 📌 Contact Us State
  const [contact, setContact] = useState({ email: "", phone: "", whatsapp: "" });

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
    if (data.success) setContact(data.data);
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
        body: JSON.stringify(contact),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("✅ Contact info updated");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("❌ Error updating contact info");
    }
  };

  // ------------------ Help Center ------------------
  const addHelp = async () => {
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
      {activeTab === "contact" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">📩 Contact Info</h2>
          <div className="grid gap-4">
            <input
              type="email"
              placeholder="Email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Whatsapp"
              value={contact.whatsapp}
              onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
              className="border px-3 py-2 rounded"
            />
          </div>
          <button
            onClick={updateContact}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
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
              value={newHelp.question}
              onChange={(e) => setNewHelp({ ...newHelp, question: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <textarea
              placeholder="Answer"
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
