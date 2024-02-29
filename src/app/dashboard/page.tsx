import DashboardTopTabs from "@/components/dashboard/tabs/tabs";
import RequireAuth from "@/components/requireAuth";
import { Metadata } from "next";
import React from "react";

const Dashboard = () => {
  return (
    <RequireAuth>
      <div className="bg-theme ">
        <div className="mx-auto px-2 sm:px-6 lg:px-16 py-8">
          <DashboardTopTabs />
        </div>
      </div>
    </RequireAuth>
  );
};

export default Dashboard;

export const metadata: Metadata = {
  title: "Transaction dashboard-Bright DiGi Gold ",
  description: "Track and manage your Gold/Silver savings effortlessly with Bright DiGi Gold’s intuitive Dashboard. ",
};
