import { TrendingUp, Package, ShoppingCart, Users } from 'lucide-react';
import { StatsCard } from '../Components/StatsCard';
import { Table, } from '../Components/Table';



export function Dashboard() {
  const recentOrders= [
    { id: '#ORD-001', customer: 'Ahmed Hassan', product: 'Wireless Headphones', amount: '$129.99', status: 'Completed' },
    { id: '#ORD-002', customer: 'Sara Mohamed', product: 'Smart Watch', amount: '$299.99', status: 'Pending' },
    { id: '#ORD-003', customer: 'Mohamed Ali', product: 'Laptop Stand', amount: '$49.99', status: 'Completed' },
    { id: '#ORD-004', customer: 'Fatma Ibrahim', product: 'Bluetooth Speaker', amount: '$79.99', status: 'Processing' },
    { id: '#ORD-005', customer: 'Omar Khaled', product: 'USB-C Cable', amount: '$19.99', status: 'Completed' },
  ];

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    { key: 'amount', label: 'Amount' },
    {
      key: 'status',
      label: 'Status',
      render: (order) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.status === 'Completed'
              ? 'bg-green-100 text-green-700'
              : order.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {order.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value="$45,231"
          icon={TrendingUp}
          trend={{ value: '12.5% from last month', isPositive: true }}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Products"
          value="1,234"
          icon={Package}
          trend={{ value: '8 new products', isPositive: true }}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Orders"
          value="892"
          icon={ShoppingCart}
          trend={{ value: '3.2% from last month', isPositive: false }}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatsCard
          title="Customers"
          value="3,456"
          icon={Users}
          trend={{ value: '145 new this month', isPositive: true }}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
        <Table columns={columns} data={recentOrders} itemsPerPage={5} />
      </div>
    </div>
  );
}
