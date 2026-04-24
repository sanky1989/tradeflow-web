import React, { useEffect, useState } from "react";
import { FileText, Users, Package, Wallet, CheckCircle, Clock, Send } from "lucide-react";
import { getDashboardSummary, getPaymentSummary } from "../../services/dashboardService";
import { getTenantLimits, getTenantUsage } from "../../services/tenantService";
import Loader from "../common/Loader";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value || 0);
};

export default function StatsGrid() {
  const [summaryStats, setSummaryStats] = useState([]);
  const [usageStats, setUsageStats] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [summaryRes, paymentRes, limitsRes, usageRes] = await Promise.all([
          getDashboardSummary(),
          getPaymentSummary(),
          getTenantLimits(),
          getTenantUsage(),
        ]);

        const summary = summaryRes?.Data || {};
        const payment = paymentRes?.Data || {};
        const limits = limitsRes?.Data || {};
        const usage = usageRes?.Data || {};

        setSummaryStats([
          {
            title: "Total Customers",
            value: summary.TotalCustomers ?? 0,
            icon: Users,
          },
          {
            title: "Total Products",
            value: summary.TotalProducts ?? 0,
            icon: Package,
          },
          {
            title: "Total Quotes",
            value: summary.TotalQuotes ?? 0,
            icon: FileText,
          },
          {
            title: "Draft Quotes",
            value: summary.DraftQuotes ?? 0,
            icon: Clock,
          },
          {
            title: "Sent Quotes",
            value: summary.SentQuotes ?? 0,
            icon: Send,
          },
          {
            title: "Completed Quotes",
            value: summary.CompletedQuotes ?? 0,
            icon: CheckCircle,
          },
          {
            title: "Total Quoted Value",
            value: formatCurrency(summary.TotalQuotedValue),
            icon: Wallet,
          },
          {
            title: "Total Paid Value",
            value: formatCurrency(summary.TotalPaidValue),
            icon: CheckCircle,
          },
        ]);

        setUsageStats([
          {
            title: "Quotes This Month",
            value: usage.QuotesThisMonth ?? 0,
            max: limits.MaxQuotesPerMonth ?? 0,
            icon: FileText,
          },
          {
            title: "Active Users",
            value: usage.CurrentUsers ?? 0,
            max: limits.MaxUsers ?? 0,
            icon: Users,
          },
          {
            title: "Suppliers",
            value: usage.CurrentSuppliers ?? 0,
            max: limits.MaxSuppliers ?? 0,
            icon: Package,
          },
          {
            title: "Installers",
            value: usage.CurrentInstallers ?? 0,
            max: limits.MaxInstallers ?? 0,
            icon: Users,
          },
        ]);

        setPaymentStats([
          {
            title: "Pending Amount",
            value: formatCurrency(payment.PendingAmount),
            icon: Clock,
          },
          {
            title: "Paid Amount",
            value: formatCurrency(payment.PaidAmount),
            icon: CheckCircle,
          },
          {
            title: "Pending Payments",
            value: payment.PendingPayments ?? 0,
            icon: Wallet,
          },
          {
            title: "Paid Payments",
            value: payment.PaidPayments ?? 0,
            icon: CheckCircle,
          },
        ]);
      } catch (err) {
        console.error("Stats error", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-6">
      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">Business Summary</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat) => (
            <div
              key={stat.title}
              className="group relative rounded-xl border border-gray-300 bg-white p-6 transition-all"
            >
              <div className="mb-3 flex items-center justify-between text-text-muted">
                <p className="text-[14px] font-bold tracking-widest leading-none text-black">
                  {stat.title}
                </p>
                <stat.icon size={14} />
              </div>
              <div className="flex items-end justify-between">
                <h3 className="font-sans text-2xl font-bold tracking-tight text-black">
                  {stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Plan Usage</h2>
          <div className="space-y-4">
            {usageStats.map((stat) => {
              const percent = stat.max > 0 ? Math.min((stat.value / stat.max) * 100, 100) : 0;

              return (
                <div key={stat.title}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{stat.title}</span>
                    <span className="text-sm text-gray-600">
                      {stat.value} / {stat.max}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-black"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Payment Summary</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {paymentStats.map((stat) => (
              <div key={stat.title} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{stat.title}</span>
                  <stat.icon size={16} />
                </div>
                <div className="text-xl font-bold text-black">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
