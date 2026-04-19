import { Search, Plus, Filter, MoreHorizontal, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { customerService } from "../../services/customerService";
import Loader from "../../components/common/Loader";

const CUSTOMER_DATA = [];

export default function Customers() {
  const [view, setView] = useState("list"); // "list" or "form"
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [CUSTOMER_DATA, setCUSTOMER_DATA] = useState([]);
   const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    CompanyName: "",
    Email: "",
    Phone: "",
    City: "",
    State: "",
    Notes: ""
  });


  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const getCustomersData = await customerService();
        console.log('customer data',getCustomersData);
        setCUSTOMER_DATA(getCustomersData.Data);
      } catch (err) {
        console.log("Stats error", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const handleOpenForm = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        FirstName: customer.FirstName || "",
        LastName: customer.LastName || "",
        CompanyName: customer.CompanyName || "",
        Email: customer.Email || "",
        Phone: customer.Phone || "",
        City: customer.City || "",
        State: customer.State || "",
        Notes: customer.Notes || ""
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        FirstName: "",
        LastName: "",
        CompanyName: "",
        Email: "",
        Phone: "",
        City: "",
        State: "",
        Notes: ""
      });
    }
    setView("form");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", editingCustomer ? "Update" : "Create", formData);
    setView("list");
  };

  const filteredCustomers = CUSTOMER_DATA.filter((customer) => {
    const matchesSearch = 
      `${customer.FirstName} ${customer.LastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.CompanyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.Email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || customer.Status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (view === "form") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-main">
              {editingCustomer ? "Update Customer" : "Create New Customer"}
            </h2>
            <p className="text-sm font-medium text-text-muted mt-1">
              Enter the details below to {editingCustomer ? "update" : "save"} the customer information.
            </p>
          </div>
          <button 
            onClick={() => setView("list")}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-text-main hover:bg-sidebar/50 transition-all"
          >
            Back to List
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">First Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.FirstName}
                  onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50 transition-all font-medium"
                  placeholder="John"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Last Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.LastName}
                  onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50 transition-all font-medium"
                  placeholder="Doe"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Company Name</label>
                <input 
                  type="text" 
                  value={formData.CompanyName}
                  onChange={(e) => setFormData({...formData, CompanyName: e.target.value})}
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50 transition-all font-medium"
                  placeholder="Acme Corp"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formData.Email}
                  onChange={(e) => setFormData({...formData, Email: e.target.value})}
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50 transition-all font-medium"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.Phone}
                  onChange={(e) => setFormData({...formData, Phone: e.target.value})}
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50 transition-all font-medium"
                  placeholder="+91 00000 00000"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">City</label>
                <input 
                  type="text" 
                  value={formData.City}
                  onChange={(e) => setFormData({...formData, City: e.target.value})}
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50 transition-all font-medium"
                  placeholder="Mumbai"
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">State</label>
                <input 
                  type="text" 
                  value={formData.State}
                  onChange={(e) => setFormData({...formData, State: e.target.value})}
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50 transition-all font-medium"
                  placeholder="Maharashtra"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Internal Notes</label>
                <textarea 
                  rows={4}
                  value={formData.Notes}
                  onChange={(e) => setFormData({...formData, Notes: e.target.value})}
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50 transition-all font-medium resize-none"
                  placeholder="Add any specific details about this client..."
                />
              </div>
            </div>

            <div className="mt-10 flex items-center justify-end gap-4 border-t border-border pt-8">
              <button 
                type="button"
                onClick={() => setView("list")}
                className="rounded-lg px-6 py-2.5 text-sm font-bold text-text-muted hover:text-text-main transition-all"
              >
                Discard Changes
              </button>
              <button 
                type="submit"
                className="rounded-lg bg-accent px-10 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {editingCustomer ? "Update Customer" : "Create Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-main">Customers</h2>
          <p className="text-sm font-medium text-text-muted mt-1">Manage and track your client details</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
        >
          <Plus size={16} />
          New Customer
        </button>
      </div>

      {/* Customer Specific Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { label: "Total Customers", value: "1,280", trend: "+12%" },
          { label: "Active Now", value: "412", trend: "-2%" },
          { label: "Lifetime Spent", value: "$142.5k", trend: "+18%" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest leading-none mb-3">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="font-sans text-2xl font-bold tracking-tight text-text-main">{stat.value}</h3>
              <span className={cn(
                "text-[11px] font-bold px-1.5 py-0.5 rounded",
                stat.trend.startsWith('+') ? "bg-success/15 text-success" : "bg-rose-500/15 text-rose-500"
              )}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-md:max-w-none max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-sidebar/50 py-2 pl-10 pr-4 text-sm text-text-main placeholder:text-text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
            <Filter size={14} className="text-text-muted" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm font-medium text-text-main outline-none cursor-pointer"
            >
              <option value="All" className="bg-card text-text-main">All Status</option>
              <option value="Active" className="bg-card text-text-main">Active</option>
              <option value="Pending" className="bg-card text-text-main">Pending</option>
              <option value="Inactive" className="bg-card text-text-main">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-sidebar/50">
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Client</th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Company & Location</th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Total Spent</th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.Id} 
                    className="group transition-colors hover:bg-bg/50 cursor-pointer"
                    onClick={() => handleOpenForm(customer)}
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-text-main">{customer.FirstName} {customer.LastName}</span>
                          <span className="text-[11px] text-text-muted">{customer.Email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-text-main">{customer.CompanyName}</span>
                        <span className="text-[11px] text-text-muted">{customer.City}, {customer.State}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded px-2 py-1 text-[11px] font-bold ring-1 ring-inset",
                        customer.Status === "Active" ? "bg-success/15 text-success ring-success/20" : 
                        customer.Status === "Pending" ? "bg-warning/15 text-warning ring-warning/20" : "bg-rose-500/15 text-rose-500 ring-rose-500/20"
                      )}>
                        {customer.Status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-[13px] font-bold text-text-main">{customer.Spent}</td>
                    <td className="px-8 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // open actions menu
                        }}
                        className="text-text-muted hover:text-text-main transition-colors p-1"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-text-muted">
                      <Search size={40} className="mb-2 opacity-20" />
                      <p className="text-[15px] font-medium">No results found</p>
                      <p className="text-xs">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border bg-sidebar/30 flex items-center justify-between text-[11px] text-text-muted">
          <span>Showing {filteredCustomers.length} of {CUSTOMER_DATA.length} customers</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-border hover:bg-card disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded border border-border hover:bg-card">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
