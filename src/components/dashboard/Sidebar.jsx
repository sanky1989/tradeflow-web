import React from "react";
import { LayoutDashboard, FileText, Package, Truck, Users, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "customers", label: "Customers", icon: Users },
  { id: "products", label: "Products", icon: Package },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "quotes", label: "Quotes", icon: FileText },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "team", label: "Team", icon: Users },
  { id: "users", label: "Users", icon: Users },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ route mapping (clean way)
  const pathMap = {
    dashboard: "/dashboard",
    customers: "/customers",
    products: "/products",
    suppliers: "/suppliers",
    quotes: "/quotes",
    analytics: "/analytics",
    team: "/team",
    users: "/users",
  };

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[240px]  bg-white border-r border-border border-gray-300 text-text-main transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="flex h-[72px] items-center border-b border-gray-300 border-border px-4 md:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent shadow-lg shadow-accent/20">
                <TrendingUp className="text-white" size={18} />
              </div>
              <span className="font-sans text-xl font-bold tracking-tight text-accent">
                TradeFlow
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(pathMap[item.id]);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(pathMap[item.id]);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all group cursor-pointer",
                    isActive
                      ? "bg-accent text-text-main"
                      : "text-black"
                  )}
                >
                  <item.icon
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-white"
                        : "text-black"
                    )}
                    size={18}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>

        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}