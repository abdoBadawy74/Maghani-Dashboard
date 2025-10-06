import { useState } from "react";
import DeliveryFee from "../../Components/DeliveryFee";
import DeliveryTime from "../../Components/DeliveryTime";
import GrowthTrend from "../../Components/GrowthTrend";
import Locations from "../../Components/Locations";
import MostFavorited from "../../Components/MostFavorited";
import TopPerformingVendors from "../../Components/topRated";

export default function VendorOverview() {
  const [activeTab, setActiveTab] = useState("deliveryFee");

  const renderContent = () => {
    switch (activeTab) {
      case "deliveryFee":
        return <DeliveryFee />;
      case "deliveryTime":
        return <DeliveryTime />;
      case "growthTrend":
        return <GrowthTrend />;
      case "locations":
        return <Locations />;
      case "mostFavorited":
        return <MostFavorited />;
      case "topRated":
        return <TopPerformingVendors />;
      default:
        return <DeliveryFee />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendors Overview</h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { id: "deliveryFee", label: "Delivery Fee" },
          { id: "deliveryTime", label: "Delivery Time" },
          { id: "growthTrend", label: "Growth Trend" },
          { id: "locations", label: "Locations" },
          { id: "mostFavorited", label: "Most Favorited" },
          { id: "topRated", label: "Top Rated" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* محتوى التاب */}
      <div className="bg-white p-6 rounded-xl shadow-md">{renderContent()}</div>
    </div>
  );
}
