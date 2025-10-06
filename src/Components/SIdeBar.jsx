import { Video as LucideIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Sidebar({ items, activePath, brandName = 'Dashboard' }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <>
            <button
                onClick={toggleMobile}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
            >
                {isMobileOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>

            <div
                className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } w-64 flex flex-col`}
            >
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">{brandName}</h1>
                    <p className="text-sm text-gray-500 mt-1">Ecommerce Admin</p>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                        {items.map((item) => {
                            const Icon = item.icon;
                            const isActive = activePath === item.path;

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                                ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@store.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {isMobileOpen && (
                <div
                    onClick={toggleMobile}
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                />
            )}
        </>
    );
}
