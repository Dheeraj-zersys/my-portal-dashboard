import React from "react";
import { useSelector } from "react-redux";
import { selectDashboardStats } from "../store/dashboardSlice";
import { Users, ListChecks, FileText, Globe } from "lucide-react";

const DashboardContent = ({ activeTab = "Dashboard" }) => {
  const stats = useSelector(selectDashboardStats);

  // If activeTab is not 'Dashboard', return blank area
  if (activeTab !== "Dashboard") {
    return <div className="flex-1 bg-gray-50 min-h-screen" />;
  }

  const cards = [
    {
      id: "users",
      title: "Users",
      value: stats?.users ?? 10,
      icon: Users,
    },
    {
      id: "businessPlan",
      title: "Business Plan",
      value: `${stats?.businessPlan?.current ?? 5}/${stats?.businessPlan?.total ?? 250}`,
      icon: ListChecks,
    },
    {
      id: "dpr",
      title: "Daily Progress Report",
      value: `${stats?.dailyProgressReport?.current ?? 10}/${stats?.dailyProgressReport?.total ?? 25}`,
      icon: FileText,
    },
    {
      id: "geoArea",
      title: "Geographical Area",
      value: stats?.geographicalArea ?? 10,
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100/60 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-emerald-800" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    {card.title}
                  </p>
                  <p className="text-xl font-bold text-emerald-800">
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-4 text-center text-xs text-gray-400">
        v0.1.0 © 2025 TG Portal. All Right Reserved
      </footer>
    </div>
  );
};

export default DashboardContent;
