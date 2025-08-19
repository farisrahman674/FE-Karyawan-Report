// src/app/login/page.tsx
"use client";

// Import hooks dan komponen yang dibutuhkan
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../api";
import Link from "next/link";

// 1. Definisikan tipe untuk state formData
// Ini akan memastikan formData selalu memiliki properti email dan password dengan tipe string.
interface LoginFormState {
  email: string;
  password: string;
}

export default function Login() {
  // 2. Gunakan tipe yang sudah didefinisikan dengan useState
  // TypeScript sekarang tahu bahwa formData harus sesuai dengan struktur LoginFormState.
  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  // Kita bisa menggunakan tipe string secara eksplisit untuk state message.
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/login", formData);
      setMessage("Login berhasil!");
      router.push("/dashboard");
    } catch (error: any) {
      // Periksa apakah error memiliki respons dan data
      const errorMessage = error.response?.data?.error || "Terjadi kesalahan.";
      setMessage(`Gagal login: ${errorMessage}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Login Karyawan
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <p className="text-center text-sm text-red-500">{message}</p>
          )}
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
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register sekarang!
          </Link>
        </p>
      </div>
    </div>
  );
}
