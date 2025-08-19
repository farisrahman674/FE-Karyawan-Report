// src/app/register/page.tsx
// Pastikan direktif "use client" ada di baris pertama
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../api";
import Link from "next/link";

// 1. Definisikan tipe untuk state data formulir
interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  department_id: string;
}

// 2. Definisikan tipe untuk data departemen yang diambil dari API
interface Department {
  id: string;
  name: string;
  // Sesuaikan dengan struktur data dari backend jika berbeda
}

export default function Register() {
  const router = useRouter();

  // 3. Gunakan tipe yang sudah didefinisikan dengan useState
  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    department_id: "",
  });

  // 4. Gunakan tipe array untuk state departments
  const [departments, setDepartments] = useState<Department[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get<Department[]>("/departments");

        setDepartments(response.data);
      } catch (error) {
        setMessage("Gagal mengambil daftar departemen.");
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/register", formData);
      setMessage("Registrasi berhasil! Silakan login.");
      setFormData({
        name: "",
        email: "",
        password: "",
        department_id: "",
      });
      router.push("/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Terjadi kesalahan.";
      setMessage(`Gagal registrasi: ${errorMessage}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Register Karyawan
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <p className="text-center text-sm text-red-500">{message}</p>
          )}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Masukkan nama"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="department_id"
              className="block text-sm font-medium text-gray-700"
            >
              Departemen
            </label>
            <select
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Pilih Departemen</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}{" "}
                  {/* Menggunakan dept.name, bukan dept.departments */}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Daftar
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login sekarang!
          </Link>
        </p>
      </div>
    </div>
  );
}
