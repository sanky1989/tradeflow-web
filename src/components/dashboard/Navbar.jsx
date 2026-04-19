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
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-border bg-bg/80 px-8 backdrop-blur-md font-sans">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-text-muted transition-colors hover:bg-sidebar md:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-text-main">Overview</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden items-center gap-3 rounded-xl bg-card border border-border px-4 py-1.5 md:flex">
          <Search className="text-text-muted" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent text-sm font-medium outline-none placeholder:text-text-muted w-32 focus:w-48 transition-all"
          />
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="group flex items-center gap-3 bg-card border border-border py-1.5 px-3 rounded-full hover:bg-sidebar transition-colors cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#B388FF] text-[11px] font-bold text-white shadow-lg shadow-accent/20">
              {initials}
            </div>
            <span className="text-sm font-medium text-text-main hidden sm:inline">
              {user?.FullName || "User"}
            </span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl border border-border bg-card p-2 shadow-2xl"
              >
                <div className="px-3 py-3 border-b border-border mb-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Account</p>
                  <p className="text-sm font-bold mt-2 text-text-main truncate">
                    {user?.FullName}
                  </p>
                </div>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-bg hover:text-text-main cursor-pointer border-none bg-transparent">
                  <User size={16} />
                  View Profile
                </button>

                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10 cursor-pointer border-none bg-transparent"
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