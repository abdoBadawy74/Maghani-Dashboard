import { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { PulseLoader } from "react-spinners";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function TrendsAndGeographicTab() {
    const [trends, setTrends] = useState(null);
    const [geoData, setGeoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Fetch Trends (لا يحتاج تاريخ)
    const fetchTrends = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                "https://api.maghni.acwad.tech/api/v1/dashboard/trends"
            );
            setTrends(res.data);
        } catch (err) {
            console.error("Error fetching trends:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Geographic Data (يحتاج تاريخ)
    const fetchGeoData = async () => {
        try {
            setGeoLoading(true);
            const res = await axios.get(
                "https://api.maghni.acwad.tech/api/v1/dashboard/geographic/stats",
                {
                    params: {
                        startDate: startDate || undefined,
                        endDate: endDate || undefined,
                    },
                }
            );
            setGeoData(res.data || []);
        } catch (err) {
            console.error("Error fetching geographic data:", err);
        } finally {
            setGeoLoading(false);
        }
    };

    useEffect(() => {
        fetchTrends();
        fetchGeoData();
    }, []);

    return (
        <div className="space-y-10">
            <h2 className="text-2xl font-bold mb-4">Dashboard Trends & Geographic Stats</h2>

            {/* Loading Spinner for Trends */}
            {loading && (
                <div className="flex justify-center py-10">
                    <PulseLoader color="#2563eb" />
                </div>
            )}

            {/* Trends Cards */}
            {!loading && trends && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <TrendCard
                        title="Revenue"
                        current={trends.revenue.current}
                        change={trends.revenue.change}
                        direction={trends.revenue.direction}
                        color="bg-blue-500"
                        suffix=" EGP"
                    />
                    <TrendCard
                        title="Orders"
                        current={trends.orders.current}
                        change={trends.orders.change}
                        direction={trends.orders.direction}
                        color="bg-green-500"
                    />
                    <TrendCard
                        title="Users"
                        current={trends.users.current}
                        change={trends.users.change}
                        direction={trends.users.direction}
                        color="bg-yellow-500"
                    />
                    <TrendCard
                        title="Avg Order Value"
                        current={trends.averageOrderValue.current}
                        change={trends.averageOrderValue.change}
                        direction={trends.averageOrderValue.direction}
                        color="bg-purple-500"
                        suffix=" EGP"
                    />
                </div>
            )}

            {/* Geographic Section */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Geographic Statistics</h3>

                {/* Date Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            className="border rounded-md px-2 py-1"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            className="border rounded-md px-2 py-1"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={fetchGeoData}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition self-end"
                    >
                        {geoLoading ? "Loading..." : "Apply Filters"}
                    </button>
                </div>

                {/* Map Loading */}
                {geoLoading && (
                    <div className="flex justify-center py-10">
                        <PulseLoader color="#2563eb" />
                    </div>
                )}

                {/* Map or No Data */}
                {!geoLoading && geoData.length === 0 && (
                    <p className="text-center text-gray-600">No geographic data available.</p>
                )}

                {!geoLoading && geoData.length > 0 && (
                    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
                        <MapContainer
                            center={[30, 30]}
                            zoom={6}
                            scrollWheelZoom
                            style={{ width: "100%", height: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {geoData.map((point, idx) => (
                                <Marker
                                    key={idx}
                                    position={[point.latitude, point.longitude]}
                                    icon={markerIcon}
                                >
                                    <Popup>
                                        <div className="text-sm">
                                            <p><strong>Orders:</strong> {point.orderCount}</p>
                                            <p><strong>Total Revenue:</strong> {point.totalRevenue} EGP</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                )}
            </div>
        </div>
    );
}

// ✅ TrendCard Component
function TrendCard({ title, current, change, direction, color, suffix }) {
    const arrow =
        direction === "up" ? "▲" : direction === "down" ? "▼" : "→";
    const arrowColor =
        direction === "up"
            ? "text-green-300"
            : direction === "down"
                ? "text-red-300"
                : "text-gray-300";

    return (
        <div className={`p-5 rounded-xl text-white shadow ${color}`}>
            <h4 className="text-sm uppercase opacity-80">{title}</h4>
            <p className="text-2xl font-bold mt-1">
                <CountUp end={current || 0} duration={2.5} separator="," decimals={2} />
                {suffix && <span>{suffix}</span>}
            </p>
            <p className={`text-sm mt-1 ${arrowColor}`}>
                {arrow} {change?.toFixed(2)}%
            </p>
        </div>
    );
}
