import React, { useEffect, useState } from "react";
import { FileText, FileEdit, Send, Wallet, DollarSign, CheckCircle, Users, Package } from "lucide-react";
import { getTenantLimits, getTenantUsage } from "../../services/tenantService";
import { getDashboardSummary, getRecentQuotes } from "../../services/dashboardService";
import Loader from "../common/Loader";

export default function StatsGrid() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const UsageData  = await getRecentQuotes();
        console.log('UsageData',UsageData );
        const SummaryData  = await getDashboardSummary();
        const data = SummaryData?.Data || {};
        console.log('datacheck',SummaryData );
        setStats([
          {
          title: "Total Customers",
          value: data.TotalCustomers || 0,
          icon: Users,
          },
          {
            title: "Total Products",
            value: data.TotalProducts || 0,
            icon: Package,
          },
          {
            title: "Total Quotes",
            value: data.TotalQuotes || 0,
            icon: FileText,
          },
          {
            title: "Draft Quotes",
            value: data.DraftQuotes || 0,
            icon: FileEdit,
          },
          {
            title: "Sent Quotes",
            value: data.SentQuotes || 0,
            icon: Send,
          },
          {
            title: "Completed Quotes",
            value: data.CompletedQuotes || 0,
            icon: CheckCircle,
          },
          {
            title: "Total Quoted Value",
            value: data.TotalQuotedValue || 0,
            icon: DollarSign,
          },
          {
            title: "Total Paid Value",
            value: data.TotalPaidValue || 0,
            icon: Wallet,
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
    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="group relative rounded-xl border text-text-main border-border border-gray-300 bg-white p-6 transition-all"
        >
          <div className="flex items-center justify-between mb-3 text-text-muted">
            <p className="text-[14px] font-bold tracking-widest leading-none text-black">{stat.title}</p>
            <stat.icon size={18} className="" />
          </div>
          <div className="flex items-end justify-between">
            <h3 className="font-sans text-2xl font-bold tracking-tight text-black">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}