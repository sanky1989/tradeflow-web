import React, { useState, useRef, useEffect } from "react";
import { Menu, Search, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const initials = user?.FullName? user.FullName.split(" ").map(n => n[0]).join(""): "";

  // outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-gray-300 border-b border-border  bg-white px-4 md:px-8 backdrop-blur-md font-sans">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border border-gray-300 bg-white text-text-muted transition-colors hover:bg-sidebar md:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-black">Overview</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden items-center gap-3 rounded-xl bg-white border border-gray-300 border-border px-4 py-1.5 md:flex">
          <Search className="text-text-muted" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent text-sm font-medium outline-none placeholder:text-text-muted w-32 focus:w-48 transition-all"
          />
        </div>

       

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="group flex items-center gap-3 bg-white border-gray-300 border border-border py-1.5 px-3 rounded-full transition-colors cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#B388FF] text-[11px] font-bold text-black shadow-lg shadow-accent/20">
              {initials}
            </div>
            <span className="text-sm font-medium text-black hidden sm:inline">
              {user?.FullName || "User"}
            </span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 mobile_proFile w-56 origin-top-right rounded-xl border border-gray-300 border-border bg-white p-2 shadow-2xl"
              >
                <div className="px-3 py-3 border-b border-border border-gray-300 mb-1">
                  <p className="text-[10px] font-bold text-black uppercase tracking-widest leading-none">Account</p>
                  <p className="text-sm font-bold mt-2 text-black truncate">
                    {user?.FullName}
                  </p>
                </div>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-black transition-colors  cursor-pointer border-none bg-transparent">
                  <User size={16} />
                  View Profile
                </button>

                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-black transition-colors cursor-pointer border-none bg-transparent"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}