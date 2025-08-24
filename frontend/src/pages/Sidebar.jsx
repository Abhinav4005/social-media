import { User, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { icon: <User size={20} />, label: "Profile", path: "/profile" },
    // { icon: <Settings size={20} />, label: "Settings", path: "/" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md space-y-4 sticky top-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Menu</h2>
      <ul className="space-y-3">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className="flex items-center gap-3 p-2 hover:bg-indigo-50 rounded-lg cursor-pointer transition duration-200"
            >
              {item.icon}
              <span className="text-gray-700 font-medium">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
