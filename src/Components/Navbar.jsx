import  { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <div className="flex items-center justify-between px-4 py-3">

                {/* Logo Section */}
                <div className="flex items-center space-x-3">
                    <button className="text-gray-600 focus:outline-none">
                        <span className="material-icons">menu</span>
                    </button>
                    <Link to="/">
                        <img src="/images/logo.svg" alt="logo" className="h-8" />
                    </Link>
                </div>

                {/* Navbar Right Section */}
                <div className="flex items-center space-x-4">

                    {/* Dropdown Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                        >
                            Select Category
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4 z-50">
                                <h4 className="font-semibold mb-2">Select Category</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>
                                        <p className="font-medium">Bootstrap Bundle</p>
                                        <p className="text-xs text-gray-500">16 unique dashboards</p>
                                    </li>
                                    <li>
                                        <p className="font-medium">Angular Bundle</p>
                                        <p className="text-xs text-gray-500">Everything for Angular projects</p>
                                    </li>
                                    <li>
                                        <p className="font-medium">Vue Bundle</p>
                                        <p className="text-xs text-gray-500">6 Premium Vue Dashboards</p>
                                    </li>
                                    <li>
                                        <p className="font-medium">React Bundle</p>
                                        <p className="text-xs text-gray-500">8 Premium React Dashboards</p>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Search Input */}
                    <form className="relative">
                        <input
                            type="search"
                            placeholder="Search here"
                            className="pl-10 pr-4 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute left-3 top-1.5 text-gray-400">
                            <i className="fas fa-search" />
                        </span>
                    </form>

                    {/* Notification Icon */}
                    <button className="relative">
                        <i className="fas fa-bell text-gray-600" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* User Avatar */}
                    <div className="relative">
                        <img
                            src="/images/faces/face8.jpg"
                            alt="Profile"
                            className="w-8 h-8 rounded-full cursor-pointer"
                            onClick={() => console.log("Open user dropdown")}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
