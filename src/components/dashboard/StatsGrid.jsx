import React, { useEffect, useState } from "react";
import { FileText, Users, Package } from "lucide-react";
import { cn } from "../../lib/utils";
import { getTenantLimits, getTenantUsage } from "../../services/tenantService";
import Loader from "../common/Loader";

export default function StatsGrid() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const limitsRes = await getTenantLimits();
        const usageRes = await getTenantUsage();
        const limits = limitsRes?.Data;
        const usage = usageRes?.Data;

        setStats([
          {
            title: "Quotes This Month",
            value: usage?.QuotesThisMonth || 0,
            change: "",
            max: limits?.MaxQuotesPerMonth || 0,
            icon: FileText,
          },
          {
            title: "Active Users  ",
            value: usage?.CurrentUsers || 0,
            max: limits?.MaxUsers || 0,
            icon: Users,
          },
          {
            title: "Suppliers",
            value: usage?.CurrentSuppliers || 0,
            max: limits?.MaxSuppliers || 0,
            icon: Package,
          },
          {
            title: "Installers",
            value: usage?.CurrentInstallers || 0,
            max: limits?.MaxInstallers || 0,
            icon: Users,
          },
        ]);
      } catch (err) {
        console.log("Stats error", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="group relative rounded-xl border text-text-main border-border border-gray-300 bg-white p-6 transition-all"
        >
          <div className="flex items-center justify-between mb-3 text-text-muted">
            <p className="text-[14px] font-bold tracking-widest leading-none text-black">{stat.title}</p>
            <stat.icon size={14} className="" />
          </div>
          <div className="flex items-end justify-between">
            <h3 className="font-sans text-2xl font-bold tracking-tight text-black">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}