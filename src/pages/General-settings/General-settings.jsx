import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function AppVersionSettings() {
  const token = localStorage.getItem("token");

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [checking, setChecking] = useState(false);

  const [form, setForm] = useState({
    androidVersion: "",
    androidEndDate: "",
    androidUrl: "",
    iosVersion: "",
    iosEndDate: "",
    iosUrl: "",
  });

  // --------------------------
  // Fetch Countries
  // --------------------------
  const fetchCountries = async () => {
    try {
      setLoadingCountries(true);
      const res = await axios.get(
        "https://api.maghni.acwad.tech/api/v1/app-version/countries-data",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCountries(res.data);
    } catch (err) {
      toast.error("Failed to load countries");
    } finally {
      setLoadingCountries(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // --------------------------
  // Check version
  // --------------------------
  const checkVersion = async () => {
    try {
      setChecking(true);

      const res = await axios.get(
        "https://api.maghni.acwad.tech/api/v1/app-version/check",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log(res);
      if (res.status === 200) {
        toast.success("Version is up to date ✔️");
      } else {
        toast.info("Unexpected response from server");
      }
    } catch (err) {
      toast.error("Failed to check version");
    } finally {
      setChecking(false);
    }
  };

  // --------------------------
  // Update version
  // --------------------------
  const updateVersion = async () => {
    try {
      setUpdating(true);

      await axios.post(
        "https://api.maghni.acwad.tech/api/v1/app-version/update",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Version updated successfully ✔️");
    } catch (err) {
      toast.error("Failed to update version");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 grid gap-6">
      <ToastContainer />

      {/* ------------------ CHECK VERSION CARD ------------------ */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">Check App Version</h2>
        <p className="text-gray-600 mb-4">
          Verify if the current app version is up to date.
        </p>

        <button
          onClick={checkVersion}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          disabled={checking}
        >
          {checking ? "Checking..." : "Check Version"}
        </button>
      </div>

      {/* ------------------ COUNTRIES CARD ------------------ */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Countries Data</h2>

        {loadingCountries ? (
          <p>Loading...</p>
        ) : countries.length === 0 ? (
          <p className="text-gray-500">No countries data found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((c) => (
              <div
                key={c.id}
                className="border p-4 rounded-lg flex gap-3 items-center shadow-sm"
              >
                <img src={c.flag} alt={c.name} className="w-10 h-10 rounded" />
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-gray-600">{c.phoneCode}</p>
                  <p className="text-xs">Currency: {c.currency}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------ UPDATE VERSION CARD ------------------ */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Update App Version</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.keys(form).map((key) => (
            <div className="flex flex-col" key={key}>
              <label className="font-medium mb-1">{key}</label>
              <input
                type="text"
                className="border px-3 py-2 rounded"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <button
          onClick={updateVersion}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Version"}
        </button>
      </div>
    </div>
  );
}
