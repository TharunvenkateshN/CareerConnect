import { useEffect, useState } from "react"
import {
  Briefcase,
  Users,
  Building2,
  TrendingUp,
} from "lucide-react"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import DashboardLayout from "../../components/layout/DashboardLayout"
import StatCard from "../../components/Cards/StatCard"

const EmployerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.DASHBOARD.OVERVIEW
      );
      if (response.status === 200) {
        setDashboardData(response.data.data); // Assuming response.data.data based on typical pattern, will verify
      }

    } catch (error) {
      console.log("error", error)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getDashboardOverview();
  }, []);

  return (
    <DashboardLayout activeMenu="employer-dashboard">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Track your recruitment progress and statistics</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Jobs Posted"
              value={dashboardData?.totalJobs || 0}
              icon={Briefcase}
              color="bg-blue-500"
              trend={{ value: 12, isPositive: true }} // Mock trend
            />
            <StatCard
              title="Active Jobs"
              value={dashboardData?.activeJobs || 0}
              icon={Building2}
              color="bg-green-500"
            />
            <StatCard
              title="Total Applications"
              value={dashboardData?.totalApplications || 0}
              icon={Users}
              color="bg-purple-500"
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Views"
              value="1.2k" // Mock data if backend doesn't provide
              icon={TrendingUp}
              color="bg-orange-500"
              trend={{ value: 8, isPositive: false }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <p className="text-gray-500 text-sm text-center py-8">No recent activity</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Applicants</h3>
            <div className="space-y-4">
              <p className="text-gray-500 text-sm text-center py-8">No new applicants</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployerDashboard
