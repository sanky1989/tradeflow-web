import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  FileEdit,
  FileText,
  Package,
  RefreshCw,
  Send,
  Users,
  Wallet,
} from "lucide-react";
import {
  getDashboardSummary,
  getPaymentSummary,
} from "../../services/dashboardService";
import { getTenantLimits, getTenantUsage } from "../../services/tenantService";
import Loader from "../common/Loader";
 
const formatNumber = (value) =>
  new Intl.NumberFormat("en-AU").format(Number(value || 0));
 
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
 
const getUsagePercent = (used, limit) => {
  if (!limit || limit <= 0) return 0;
  return Math.min(Math.round((used / limit) * 100), 100);
};
 
const buildUsageLabel = (used, limit) => {
  if (!limit || limit <= 0) {
    return `${formatNumber(used)} / Unlimited`;
  }
 
  return `${formatNumber(used)} / ${formatNumber(limit)}`;
};
 
export default function StatsGrid() {
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState(null);
  const [limits, setLimits] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  const loadStats = async () => {
    setLoading(true);
    setError("");
 
    try {
      const [summaryRes, paymentRes, limitsRes, usageRes] = await Promise.all([
        getDashboardSummary(),
        getPaymentSummary(),
        getTenantLimits(),
        getTenantUsage(),
      ]);
 
      setSummary(summaryRes.Data || {});
      setPayments(paymentRes.Data || {});
      setLimits(limitsRes.Data || {});
      setUsage(usageRes.Data || {});
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(err?.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadStats();
  }, []);
 
  if (loading) return <Loader />;
 
  if (error) {
    return (
      <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5" />
          <div>
            <p className="font-semibold">Dashboard statistics could not be loaded.</p>
            <p className="mt-1 text-sm">{error}</p>
            <button
              type="button"
              onClick={loadStats}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  const topCards = [
    {
      title: "Total Customers",
      value: formatNumber(summary?.TotalCustomers),
      icon: Users,
      helper: "Customers created",
    },
    {
      title: "Total Products",
      value: formatNumber(summary?.TotalProducts),
      icon: Package,
      helper: "Products available",
    },
    {
      title: "Total Quotes",
      value: formatNumber(summary?.TotalQuotes),
      icon: FileText,
      helper: "All quotes",
    },
    {
      title: "Completed Quotes",
      value: formatNumber(summary?.CompletedQuotes),
      icon: CheckCircle,
      helper: "Completed workflow",
    },
    {
      title: "Draft Quotes",
      value: formatNumber(summary?.DraftQuotes),
      icon: FileEdit,
      helper: "Still being prepared",
    },
    {
      title: "Sent Quotes",
      value: formatNumber(summary?.SentQuotes),
      icon: Send,
      helper: "Sent to customers",
    },
    {
      title: "Quoted Value",
      value: formatCurrency(summary?.TotalQuotedValue),
      icon: DollarSign,
      helper: "Total quoted amount",
    },
    {
      title: "Paid Value",
      value: formatCurrency(summary?.TotalPaidValue),
      icon: Wallet,
      helper: "Total paid amount",
    },
  ];
 
  const paymentCards = [
    {
      title: "Pending Amount",
      value: formatCurrency(payments?.PendingAmount),
      helper: `${formatNumber(payments?.PendingPayments)} pending payment(s)`,
    },
    {
      title: "Paid Amount",
      value: formatCurrency(payments?.PaidAmount),
      helper: `${formatNumber(payments?.PaidPayments)} paid payment(s)`,
    },
  ];
 
  const usageCards = [
    {
      title: "Quotes This Month",
      used: usage?.QuotesThisMonth || 0,
      limit: limits?.MaxQuotesPerMonth || 0,
    },
    {
      title: "Users",
      used: usage?.CurrentUsers || 0,
      limit: limits?.MaxUsers || 0,
    },
    {
      title: "Suppliers",
      used: usage?.CurrentSuppliers || 0,
      limit: limits?.MaxSuppliers || 0,
    },
    {
      title: "Installers",
      used: usage?.CurrentInstallers || 0,
      limit: limits?.MaxInstallers || 0,
    },
  ];
 
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {topCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-gray-300 bg-white p-6 transition-all hover:shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-bold uppercase tracking-wider text-gray-600">
                {card.title}
              </p>
              <card.icon size={18} className="text-gray-700" />
            </div>
            <h3 className="text-[22px] font-bold tracking-tight text-black">
              {card.value}
            </h3>
            <p className="mt-1 text-xs font-medium text-gray-500">{card.helper}</p>
          </div>
        ))}
      </div>
 
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-300 bg-white p-6 xl:col-span-1">
          <div className="mb-5">
            <p className="text-[15px] font-bold text-black">Payment Summary</p>
            <p className="mt-1 text-xs font-medium text-gray-500">
              Payments grouped by paid and pending status
            </p>
          </div>
 
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {paymentCards.map((card) => (
              <div key={card.title} className="rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {card.title}
                </p>
                <p className="mt-2 text-xl font-bold text-black">{card.value}</p>
                <p className="mt-1 text-xs font-medium text-gray-500">{card.helper}</p>
              </div>
            ))}
          </div>
        </div>
 
        <div className="rounded-xl border border-gray-300 bg-white p-6 xl:col-span-2">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <p className="text-[15px] font-bold text-black">Tenant Usage</p>
              <p className="mt-1 text-xs font-medium text-gray-500">
                Current usage against tenant plan limits
              </p>
            </div>
 
            {limits?.PlanCode && (
              <span className="inline-flex w-fit rounded-full border border-gray-300 px-3 py-1 text-xs font-bold text-gray-700">
                Plan: {limits.PlanCode}
              </span>
            )}
          </div>
 
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {usageCards.map((card) => {
              const percent = getUsagePercent(card.used, card.limit);
 
              return (
                <div key={card.title}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">{card.title}</p>
                    <p className="text-sm font-bold text-black">
                      {buildUsageLabel(card.used, card.limit)}
                    </p>
                  </div>
 
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
 
                  <p className="mt-1 text-xs text-gray-500">{percent}% used</p>
                </div>
              );
            })}
          </div>
 
          {limits?.CanUseManufacturing && (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              Manufacturing module is available for this tenant.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}