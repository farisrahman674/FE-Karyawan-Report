// src/app/dashboard/Sidebar.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import apiClient from "../api";
import { FiMenu, FiX } from "react-icons/fi";

// Tipe data untuk item navigasi
interface NavItem {
  id: string;
  name: string;
  icon: string;
}

interface SidebarProps {
  activePage: string;
  setActivePage: (pageId: string) => void;
  navItems: NavItem[];
}

export default function Sidebar({
  activePage,
  setActivePage,
  navItems,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      // Kirim permintaan ke endpoint logout
      await apiClient.post("/auth/logout");
      // Arahkan kembali ke halaman login
      router.push("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <>
      {/* Collapsed Sidebar (mobile) */}
      <aside className="fixed md:hidden top-0 left-0 h-full w-16 bg-gray-900 flex flex-col items-center py-4 mr-5 z-50">
        {/* Logo / Hamburger */}
        <button
          onClick={() => setIsOpen(true)}
          className="text-white hover:text-blue-400"
        >
          <FiMenu size={24} />
        </button>
      </aside>

      {/* Expanded Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col p-4 z-50 transform transition-transform duration-300
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold">Portal Karyawan</div>
          {/* Close button di mobile */}
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-grow">
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className="mb-2">
                <button
                  onClick={() => {
                    setActivePage(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left py-2 px-4 rounded-md flex items-center transition-colors duration-200
                    ${
                      activePage === item.id
                        ? "bg-blue-600 font-semibold"
                        : "hover:bg-gray-700"
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay pas expanded di mobile */}
      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
