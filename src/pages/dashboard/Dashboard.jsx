import React from "react";
import RecentTable from "../../components/dashboard/RecentTable";
import StatsGrid from "../../components/dashboard/StatsGrid";

export default function Dashboard() {
  return (
    <>
      <StatsGrid />
      <RecentTable />
    </>
  );
}

