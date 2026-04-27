import StatsGrid from "../../components/dashboard/StatsGrid";
import RecentTable from "../../components/dashboard/RecentTable";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <StatsGrid />
      <RecentTable />
    </div>
  );
}