// src/app/dashboard/DashboardLayout.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import UploadTaskPage from "./UploadTaskPage";
import ViewTasksPage from "./ViewTasksPage";

// Daftar item navigasi
const allNavItems = [
  { id: "uploadTask", name: "Unggah Tugas", icon: "📄" },
  { id: "viewTasks", name: "Lihat Tugas", icon: "📊" },
];
interface UserData {
  id: string;
  name: string;
  email: string;
  department_name: string;
  department_id: string;
}
interface DashboardLayoutProps {
  user: UserData;
  isManager: boolean;
}

export default function DashboardLayout({
  user,
  isManager,
}: DashboardLayoutProps) {
  const [activePage, setActivePage] = useState("viewTasks");

  // Filter item navigasi berdasarkan peran pengguna
  const navItems = isManager
    ? allNavItems.filter((item) => item.id !== "uploadTask")
    : allNavItems;

  // Efek untuk mengalihkan manajer jika mereka berada di halaman yang tidak relevan
  useEffect(() => {
    if (isManager && activePage === "uploadTask") {
      setActivePage("viewTasks");
    }
  }, [isManager, activePage]);

  const renderContent = () => {
    switch (activePage) {
      case "uploadTask":
        // Pastikan halaman ini tidak di-render untuk manajer
        if (!isManager) {
          return <UploadTaskPage user={user} />;
        }
        return null;
      case "viewTasks":
        return <ViewTasksPage isManager={isManager} user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        navItems={navItems}
      />

      <main className="flex-1 flex flex-col overflow-hidden ml-5">
        <Navbar user={user} activePage={activePage} navItems={navItems} />

        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow-md p-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
