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
  const [newHelp, setNewHelp] = useState({
    question_en: "",
    question_ar: "",
    answer_en: "",
    answer_ar: ""
  });


  // 📌 Policies State
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({
    title_en: "",
    title_ar: "",
    content_en: "",
    content_ar: ""
  });


  // Edit Help
  const [showEditHelpPopup, setShowEditHelpPopup] = useState(false);
  const [currentHelp, setCurrentHelp] = useState(null);

  // Edit Policy
  const [showEditPolicyPopup, setShowEditPolicyPopup] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState(null);


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
        body: JSON.stringify(newContact), // contact is array of {type, value}
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Contact info updated");
        setShowAddPopup(false);
        setNewContact({ type: "", value: "" });
        fetchContact();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Error updating contact info");
    }
  };

  const deleteContact = (index) => {
    axios.delete(`https://api.maghni.acwad.tech/api/v1/setting/contact-us/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { value: index }
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
    if (!newHelp.question_en || !newHelp.question_ar || !newHelp.answer_en || !newHelp.answer_ar) {
      toast.error("⚠️ Please fill all fields");
      return;
    }

    const body = {
      question: {
        en: newHelp.question_en,
        ar: newHelp.question_ar
      },
      answer: {
        en: newHelp.answer_en,
        ar: newHelp.answer_ar
      }
    };

    try {
      const res = await fetch("https://api.maghni.acwad.tech/api/v1/setting/help-center", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("🟢 Added Successfully");
        setNewHelp({ question_en: "", question_ar: "", answer_en: "", answer_ar: "" });
        fetchHelpCenter();
      } else {
        toast.error(data.message || "Failed");
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

  const editHelp = (item) => {
    setCurrentHelp({
      id: item.id,
      question_en: item.question.en,
      question_ar: item.question.ar,
      answer_en: item.answer.en,
      answer_ar: item.answer.ar
    });
    setShowEditHelpPopup(true);
  };

  const updateHelp = async () => {
    const body = {
      question: {
        en: currentHelp.question_en,
        ar: currentHelp.question_ar
      },
      answer: {
        en: currentHelp.answer_en,
        ar: currentHelp.answer_ar
      }
    };

    const res = await fetch(`https://api.maghni.acwad.tech/api/v1/setting/help-center/${currentHelp.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      toast.success("Updated Successfully");
      setShowEditHelpPopup(false);
      fetchHelpCenter();
    } else {
      toast.error(data.message || "Update Failed");
    }
  };



  // ------------------ Policies ------------------
  const addPolicy = async () => {
    if (!newPolicy.title_en || !newPolicy.title_ar || !newPolicy.content_en || !newPolicy.content_ar) {
      toast.error("⚠️ Please fill all fields");
      return;
    }
    const body = {
      title: { en: newPolicy.title_en, ar: newPolicy.title_ar },
      content: { en: newPolicy.content_en, ar: newPolicy.content_ar }
    };

    const res = await fetch("https://api.maghni.acwad.tech/api/v1/setting/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      toast.success("Policy Added");
      setNewPolicy({ title_en: "", title_ar: "", content_en: "", content_ar: "" });
      fetchPolicies();
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

  const editPolicy = (item) => {
    setCurrentPolicy({
      id: item.id,
      title_en: item.title.en,
      title_ar: item.title.ar,
      content_en: item.content.en,
      content_ar: item.content.ar
    });
    setShowEditPolicyPopup(true);
  };

  const updatePolicy = async () => {
    const body = {
      title: {
        en: currentPolicy.title_en,
        ar: currentPolicy.title_ar
      },
      content: {
        en: currentPolicy.content_en,
        ar: currentPolicy.content_ar
      }
    };

    const res = await fetch(`https://api.maghni.acwad.tech/api/v1/setting/policies/${currentPolicy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      toast.success("Policy Updated");
      setShowEditPolicyPopup(false);
      fetchPolicies();
    } else {
      toast.error(data.message || "Update Failed");
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
                    deleteContact(item.value);
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
              placeholder="Question (English)"
              value={newHelp.question_en}
              onChange={(e) => setNewHelp({ ...newHelp, question_en: e.target.value })}
              className="border px-3 py-2 rounded"
            />

            <input
              type="text"
              placeholder="Question (Arabic)"
              value={newHelp.question_ar}
              onChange={(e) => setNewHelp({ ...newHelp, question_ar: e.target.value })}
              className="border px-3 py-2 rounded"
            />

            <textarea
              placeholder="Answer (English)"
              value={newHelp.answer_en}
              onChange={(e) => setNewHelp({ ...newHelp, answer_en: e.target.value })}
              className="border px-3 py-2 rounded"
            />

            <textarea
              placeholder="Answer (Arabic)"
              value={newHelp.answer_ar}
              onChange={(e) => setNewHelp({ ...newHelp, answer_ar: e.target.value })}
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
                  <td className="p-2 border">
                    <div><b>EN:</b> {h.question.en}</div>
                    <div><b>AR:</b> {h.question.ar}</div>
                  </td>
                  <td className="p-2 border">
                    <div><b>EN:</b> {h.answer.en}</div>
                    <div><b>AR:</b> {h.answer.ar}</div>
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => deleteHelp(h.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => editHelp(h)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
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
              placeholder="Title (English)"
              value={newPolicy.title_en}
              onChange={(e) => setNewPolicy({ ...newPolicy, title_en: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Title (Arabic)"
              value={newPolicy.title_ar}
              onChange={(e) => setNewPolicy({ ...newPolicy, title_ar: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <textarea
              placeholder="Content (English)"
              value={newPolicy.content_en}
              onChange={(e) => setNewPolicy({ ...newPolicy, content_en: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <textarea
              placeholder="Content (Arabic)"
              value={newPolicy.content_ar}
              onChange={(e) => setNewPolicy({ ...newPolicy, content_ar: e.target.value })}
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
                  <td className="p-2 border">
                    <div><b>EN:</b> {p.title.en}</div>
                    <div><b>AR:</b> {p.title.ar}</div>
                  </td>
                  <td className="p-2 border">
                    <div><b>EN:</b> {p.content.en}</div>
                    <div><b>AR:</b> {p.content.ar}</div>
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => deletePolicy(p.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => editPolicy(p)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ----------------- help popup ----------------- */}
      {showEditHelpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-96 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Help</h3>

            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Question (EN)"
              value={currentHelp.question_en}
              onChange={(e) => setCurrentHelp({ ...currentHelp, question_en: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Question (AR)"
              value={currentHelp.question_ar}
              onChange={(e) => setCurrentHelp({ ...currentHelp, question_ar: e.target.value })}
            />

            <textarea
              className="border p-2 w-full mb-2 rounded"
              placeholder="Answer (EN)"
              value={currentHelp.answer_en}
              onChange={(e) => setCurrentHelp({ ...currentHelp, answer_en: e.target.value })}
            />

            <textarea
              className="border p-2 w-full mb-2 rounded"
              placeholder="Answer (AR)"
              value={currentHelp.answer_ar}
              onChange={(e) => setCurrentHelp({ ...currentHelp, answer_ar: e.target.value })}
            />

            <div className="flex justify-end gap-3 mt-3">
              <button
                className="bg-gray-400 text-white px-3 py-2 rounded"
                onClick={() => setShowEditHelpPopup(false)}
              >
                Cancel
              </button>

              <button
                className="bg-blue-600 text-white px-3 py-2 rounded"
                onClick={updateHelp}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ----------------- policies popup ----------------- */}
      {showEditPolicyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-96 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Policy</h3>

            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Title (EN)"
              value={currentPolicy.title_en}
              onChange={(e) => setCurrentPolicy({ ...currentPolicy, title_en: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Title (AR)"
              value={currentPolicy.title_ar}
              onChange={(e) => setCurrentPolicy({ ...currentPolicy, title_ar: e.target.value })}
            />

            <textarea
              className="border p-2 w-full mb-2 rounded"
              placeholder="Content (EN)"
              value={currentPolicy.content_en}
              onChange={(e) => setCurrentPolicy({ ...currentPolicy, content_en: e.target.value })}
            />

            <textarea
              className="border p-2 w-full mb-2 rounded"
              placeholder="Content (AR)"
              value={currentPolicy.content_ar}
              onChange={(e) => setCurrentPolicy({ ...currentPolicy, content_ar: e.target.value })}
            />

            <div className="flex justify-end gap-3 mt-3">
              <button
                className="bg-gray-400 text-white px-3 py-2 rounded"
                onClick={() => setShowEditPolicyPopup(false)}
              >
                Cancel
              </button>

              <button
                className="bg-blue-600 text-white px-3 py-2 rounded"
                onClick={updatePolicy}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
