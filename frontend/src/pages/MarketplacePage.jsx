import React, { useState } from "react";
import { Search, MapPin, Plus, Tag, Laptop, Sofa, Smartphone, Bike, Camera } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FeedLayout from "../components/FeedLayout";

const products = [
  { id: 1, title: 'MacBook Air M2 13"', price: "$830", location: "New York", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "Modern Linen Sofa Set", price: "$450", location: "Brooklyn", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "iPhone 14 Pro 256GB", price: "$999", location: "New York", image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=600&auto=format&fit=crop" },
  { id: 4, title: "Nordic Wood Dining Table", price: "$350", location: "Queens", image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=600&auto=format&fit=crop" },
  { id: 5, title: "Vintage Urban Bicycle", price: "$250", location: "Brooklyn", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop" },
  { id: 6, title: "Sony A7IV Mirrorless Camera", price: "$1,200", location: "Manhattan", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop" },
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <>
      <Navbar />
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Marketplace</h1>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400">Buy and sell items in your local community</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-3 py-2 rounded-xl shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  New York • 25 km
                </span>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Sell item
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight mb-4">Today's picks</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((item) => (
                  <div key={item.id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer">
                    <div className="aspect-square w-full overflow-hidden relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <p className="text-base font-black text-indigo-600 dark:text-indigo-400">{item.price}</p>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate mt-0.5">{item.title}</h4>
                      <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 mt-1">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}
