// src/app/dashboard/Navbar.tsx
import { useMemo } from "react";

// Tipe data untuk item navigasi
interface NavItem {
  id: string;
  name: string;
  icon: string;
}

interface NavbarProps {
  user: { name: string };
  activePage: string;
  navItems: NavItem[];
}

export default function Navbar({ user, activePage, navItems }: NavbarProps) {
  // Gunakan useMemo agar tidak menghitung ulang judul halaman setiap render
  const pageTitle = useMemo(() => {
    return navItems.find((item) => item.id === activePage)?.name;
  }, [activePage, navItems]);

  return (
    <header className="flex justify-end items-center bg-white shadow-md p-4">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">
          Selamat datang, <span className="font-semibold">{user.name}</span>
        </span>
      </div>
    </header>
  );
}
