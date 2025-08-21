import { Bell, Home, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MySocial
        </Link>

        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users or posts..."
            className="bg-transparent outline-none ml-2 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-6">
          {/* <Link to="/feed">
            <Home className="w-6 h-6 text-gray-600 hover:text-blue-600" />
          </Link> */}
          <Link to="/notifications">
            <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600" />
          </Link>
          <Link to="/profile">
            <User className="w-6 h-6 text-gray-600 hover:text-blue-600" />
          </Link>
        </div>
      </div>
    </nav>
  );
}