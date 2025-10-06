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
import RequireBack from './pages/Auth/RequireBack';
import RequireAuth from './pages/Auth/RequireAuth';

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
    <Routes>
      {/* لو المستخدم داخل بالفعل، مايرجعش للوجن */}
      <Route path="/login" element={<RequireBack><Login /></RequireBack>} />

      {/* باقي الصفحات محتاجة توكن */}
      <Route
        path="/*"
        element={
          <RequireAuth>
            <DashboardLayout sidebarItems={sidebarItems} activePath={location.pathname} brandName="Maghani Store">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/banners" element={<Banners />} />
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/vendors/overview" element={<VendorOverview />} />
                <Route path="/vendors/statistics" element={<VendorsStatistics />} />
              </Routes>
            </DashboardLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
