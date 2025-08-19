// src/app/dashboard/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardLayout from "./DashboardLayout";
import apiClient from "../api";

// Definisikan interface untuk struktur data pengguna yang didapat dari backend
interface UserData {
  id: string;
  name: string;
  email: string;
  department_name: string;
  department_id: string;
}

// Komponen Server yang menangani semua logika otorisasi dan pengambilan data
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    redirect("/login");
  }

  try {
    // Lakukan panggilan API ke backend untuk mendapatkan data pengguna
    const response = await apiClient.get<UserData>("/auth/me", {
      headers: {
        Cookie: `accessToken=${accessToken.value}`,
      },
    });

    const user = response.data;
    const isManager = user.department_name === "Manager";

    // Meneruskan data user dan isManager ke DashboardLayout (Client Component)
    return <DashboardLayout user={user} isManager={isManager} />;
  } catch (error) {
    console.error("Gagal mendapatkan data pengguna:", error);
    redirect("/login");
  }
}
