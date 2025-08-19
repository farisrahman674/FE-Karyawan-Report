// src/app/dashboard/UploadTaskPage.tsx
"use client";

import { useState, useMemo } from "react";
import apiClient from "../api";
import Swal from "sweetalert2";

// Definisikan interface untuk struktur data pengguna.
interface UserData {
  id: string;
  name: string;
  email: string;
  department_name: string;
  department_id: string;
}

export default function UploadTaskPage({ user }: { user: UserData }) {
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Gunakan useMemo untuk menghitung teks placeholder hanya saat department_name berubah
  const placeholderText = useMemo(() => {
    switch (user.department_name) {
      case "Creative":
        return "Contoh: https://www.youtube.com/";
      case "Sales":
        return "Contoh: https://docs.google.com/";
      default:
        return "Masukkan tautan URL di sini...";
    }
  }, [user.department_name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Reset pesan
    setLoading(true);

    try {
      // Mengirim data formulir ke API dengan departmentId dari prop user.
      const response = await apiClient.post("/task", {
        title,
        link_url: linkUrl,
        department_id: user.department_id,
      });

      if (response.status !== 201) {
        throw new Error("Gagal mengunggah tugas");
      }

      setMessage("Tugas berhasil diunggah! 🎉");
      setTitle("");
      setLinkUrl("");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || // kalau backend kirim { message: "..." }
        error.response?.data?.error || // kalau backend kirim { error: "..." }
        error.message;
      Swal.fire({
        icon: "error",
        title: "Gagal mengunggah tugas",
        text: errorMsg,
        timer: 2000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Unggah Tugas Baru
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Departemen Anda
          </label>
          <div className="mt-1 p-2 rounded-md bg-gray-100 text-gray-800 font-semibold">
            {user.department_name}
          </div>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Judul Tugas
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="link_url"
            className="block text-sm font-medium text-gray-700"
          >
            Tautan URL
          </label>
          <input
            type="url"
            id="link_url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder={placeholderText}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
        >
          {loading ? "Mengunggah..." : "Unggah Tugas"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm font-medium ${
            message.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
