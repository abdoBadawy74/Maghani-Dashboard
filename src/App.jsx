import { Routes, Route, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, Users, Settings, BarChart3, Puzzle, ChartColumnStacked, Store, ChartBar, } from 'lucide-react';
import { DashboardLayout } from './Components/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Banners from './pages/Banners/Banners';
// import RequireAuth from "./pages/Auth/RequireAuth"
import { FaInfoCircle } from "react-icons/fa";
import Coupons from './pages/Coupons/Coupons';
import Orders from './pages/Orders/Orders';
import Categories from './pages/Categories/Categories';
import SettingsPage from './pages/Settings/Settings';
import Vendors from './pages/Vendors/Vendors';
import VendorOverview from './pages/Vendors/VendorOverview';
import VendorsStatistics from './pages/VendorsStatistics';

function App() {
  const location = useLocation();

  const sidebarItems = [
    { label: 'Dashboard', icon: Home, path: '/' },
    { label: 'Banners', icon: FaInfoCircle, path: '/banners' },
    { label: 'Coupons', icon: Puzzle, path: '/coupons' },
    { label: 'Orders', icon: ShoppingCart, path: '/orders' },
    { label: 'Categories', icon: ChartColumnStacked, path: '/categories' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Vendors', icon: Store, path: '/vendors' },
    { label: 'Statistics', icon: ChartBar, path: '/vendors/statistics' },

    // { label: 'Products', icon: Package, path: '/products' },
    // { label: 'Customers', icon: Users, path: '/customers' },
    // { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activePath={location.pathname}
      brandName="MyStore"
    >
      <Routes>

        <Route path='login' element={<Login />} />

        <Route path="/" element={<Dashboard />} />
        <Route path="/banners" element={<Banners />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendors/overview" element={<VendorOverview />} />
        <Route path="/vendors/statistics" element={<VendorsStatistics />} />
        {/* <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route
          path="/analytics"
          element={
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">Analytics page coming soon...</p>
            </div>
          }
        />
        <Route
          path="/settings"
          element={
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Settings page coming soon...</p>
            </div>
          }
        /> */}
      </Routes>
    </DashboardLayout>
  );
}

export default App;
