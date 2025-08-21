import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-blue-50 to-indigo-100 py-10 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-600 gap-6">
        {/* Left side */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} <span className="font-semibold">MySocial</span>. All rights reserved.
        </p>

        {/* Center links */}
        <div className="flex gap-8 text-sm font-medium">
          {["Privacy", "Terms", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="relative group transition"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Right side social icons */}
        <div className="flex gap-5">
          <a href="#" className="p-2 rounded-full bg-white shadow hover:shadow-lg transition">
            <Facebook className="w-4 h-4 text-blue-600" />
          </a>
          <a href="#" className="p-2 rounded-full bg-white shadow hover:shadow-lg transition">
            <Twitter className="w-4 h-4 text-sky-500" />
          </a>
          <a href="#" className="p-2 rounded-full bg-white shadow hover:shadow-lg transition">
            <Instagram className="w-4 h-4 text-pink-500" />
          </a>
        </div>
      </div>
    </footer>
  );
}
