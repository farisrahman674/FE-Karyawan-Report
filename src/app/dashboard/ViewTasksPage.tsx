// src/app/dashboard/ViewTasksPage.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient from "../api";
import { FaCheck, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

// Definisikan interface untuk struktur data tugas yang diharapkan dari API
interface Task {
  id: string;
  title: string;
  link_url: string;
  department_name: string;
  status: string;
  comment: string | null;
  created_at: string;
  employee?: {
    name: string;
  };
}

// Definisikan interface untuk data filter dari API
interface FilterData {
  years: number[];
  months: number[];
  departments: string[];
}

// Definisikan interface untuk struktur respons API yang lengkap
interface ApiResponse {
  page: number;
  limit: number;
  totalTasks: number;
  totalPages: number;
  data: Task[];
}

// Definisikan interface untuk data pengguna yang diterima dari props
interface UserData {
  id: string;
  name: string;
  email: string;
  department_name: string;
  department_id: string;
}

// Komponen utama untuk halaman "Lihat Tugas"
export default function ViewTasksPage({
  isManager,
  user,
}: {
  isManager: boolean;
  user: UserData;
}) {
  // State untuk data filter yang tersedia
  const [filterData, setFilterData] = useState<FilterData | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [errorFilters, setErrorFilters] = useState<string | null>(null);

  // State untuk filter yang dipilih
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  // State baru untuk kontrol pengurutan dan pengelompokan
  const [groupBy, setGroupBy] = useState<"year" | "month" | "department">(
    "year"
  );
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // --- PAGINASI: State baru untuk halaman dan batas ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // State untuk batas per halaman

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectTaskId, setRejectTaskId] = useState<string | null>(null);
  const [fixModalOpen, setFixModalOpen] = useState(false);
  const [fixLink, setFixLink] = useState("");
  const [fixTaskId, setFixTaskId] = useState<string | null>(null);
  // Efek untuk mengambil data filter (dropdown) saat komponen dimuat
  useEffect(() => {
    async function fetchFilterData() {
      try {
        setLoadingFilters(true);
        const endpoint = isManager ? "/dateTask" : "/myDateTask";
        const response = await apiClient.get<FilterData>(endpoint);
        setFilterData(response.data);
      } catch (err) {
        console.error("Gagal mengambil data filter:", err);
        setErrorFilters("Gagal memuat data filter.");
      } finally {
        setLoadingFilters(false);
      }
    }
    fetchFilterData();
  }, [isManager]);

  // Efek untuk mengambil daftar tugas saat filter, halaman, atau limit berubah
  const fetchTasks = useCallback(async () => {
    try {
      setLoadingTasks(true);
      setErrorTasks(null); // Reset error state

      const params = new URLSearchParams();
      if (selectedYear) params.append("year", selectedYear.toString());
      if (selectedMonth) params.append("month", selectedMonth.toString());
      if (selectedDepartment) params.append("department", selectedDepartment);

      // --- PAGINASI: Tambahkan parameter halaman dan batas ---
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());

      const endpoint = isManager
        ? `/task?${params.toString()}`
        : `/myTask?${params.toString()}`;

      console.log(`Mengambil data dari: ${endpoint}`);
      const response = await apiClient.get<ApiResponse>(endpoint);
      console.log("Respons API:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setTasks(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setLimit(response.data.limit || 10);
      } else {
        setTasks([]);
        setTotalPages(1);
        setErrorTasks("Respons API tidak valid. Harap periksa endpoint.");
      }
    } catch (err: any) {
      console.error("Gagal mengambil tugas:", err);
      setErrorTasks("Gagal memuat daftar tugas. Silakan coba lagi nanti.");
    } finally {
      setLoadingTasks(false);
    }
  }, [
    isManager,
    selectedYear,
    selectedMonth,
    selectedDepartment,
    currentPage,
    limit,
  ]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- PAGINASI: Tambahkan currentPage dan limit sebagai dependency useEffect ---

  // Helper function untuk mengelompokkan tugas secara dinamis
  const groupTasks = (tasks: Task[], key: "year" | "month" | "department") => {
    const grouped: { [groupKey: string]: Task[] } = {};

    tasks.forEach((task) => {
      let groupKey = "";
      const date = new Date(task.created_at);

      if (key === "year") {
        groupKey = date.getFullYear().toString();
      } else if (key === "month") {
        // Menggunakan format YYYY-MM untuk pengurutan yang benar
        groupKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      } else if (key === "department") {
        groupKey = task.department_name;
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(task);
    });

    return grouped;
  };

  // Mengurutkan tugas terlebih dahulu
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const groupedTasks = groupTasks(sortedTasks, groupBy);
  const groupKeys = Object.keys(groupedTasks).sort((a, b) => {
    if (groupBy === "year" || groupBy === "month") {
      return sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    }
    return a.localeCompare(b);
  });

  const getStatusStyle = (status: string | undefined) => {
    if (!status) {
      return "bg-gray-100 text-gray-800";
    }
    console.log(status);

    switch (status.toLowerCase()) {
      case "accept":
        return "bg-green-100 text-green-800";
      case "reject":
        return "bg-red-100 text-yellow-800";
      case "menunggu":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fungsi helper untuk mendapatkan nama bulan tanpa date-fns
  const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("id-ID", { month: "long" });
  };

  const getGroupTitle = (groupKey: string, groupBy: string) => {
    if (groupBy === "year") {
      return `Tugas Tahun ${groupKey}`;
    } else if (groupBy === "month") {
      const [year, month] = groupKey.split("-");
      return `Tugas Bulan ${getMonthName(Number(month))} ${year}`;
    } else if (groupBy === "department") {
      return `Tugas Departemen ${groupKey}`;
    }
    return groupKey;
  };

  // Fungsi untuk membuat array nomor halaman
  // Ini diperbarui agar lebih efisien untuk jumlah halaman yang besar
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };
  const handleAccept = async (taskId: string) => {
    try {
      const response = await apiClient.patch(`/task/${taskId}/accept`, {
        status: "Accept",
        comment: null,
      });

      console.log("Task accepted:", response.data);
      await fetchTasks(); // refresh dari server
    } catch (error) {
      console.error("Gagal menerima tugas:", error);
    }
  };

  const handleOpenRejectModal = (taskId: string) => {
    setRejectTaskId(taskId);
    setRejectComment("");
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectTaskId) return;
    if (!rejectComment.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Komen harus diisi",
        text: "Silakan masukkan alasan penolakan sebelum mengirim.",
        timer: 1000, // 3 detik
        timerProgressBar: false,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await apiClient.patch(`/task/${rejectTaskId}/reject`, {
        status: "Reject",
        comment: rejectComment,
      });

      console.log("Task rejected:", response.data);
      setRejectModalOpen(false);
      setRejectComment("");
      setRejectTaskId(null);
      await fetchTasks(); // refresh dari server
    } catch (error) {
      console.error("Gagal menolak tugas:", error);
    }
  };

  const handleFixTask = async () => {
    if (!fixTaskId) return;

    try {
      await apiClient.patch(`/fixTask/${fixTaskId}`, {
        link_url: fixLink,
      });
      setFixModalOpen(false);
      setFixLink("");
      setFixTaskId(null);
      fetchTasks(); // refresh tabel
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
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white min-h-[500px] flex flex-col">
      <h3 className="text-xl font-bold text-gray-700 mb-4">
        {isManager ? "Semua Tugas" : "Tugas Saya"}
      </h3>

      {/* Filter dropdowns */}
      {(isManager || !isManager) && (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {loadingFilters ? (
            <p className="text-gray-500">Memuat filter...</p>
          ) : errorFilters ? (
            <p className="text-red-500">{errorFilters}</p>
          ) : (
            <>
              {/* Dropdown untuk Tahun */}
              <select
                value={selectedYear || ""}
                onChange={(e) => {
                  setSelectedYear(
                    e.target.value ? Number(e.target.value) : null
                  );
                  setCurrentPage(1);
                }}
                className="w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Semua Tahun</option>
                {filterData?.years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Dropdown untuk Bulan */}
              <select
                value={selectedMonth || ""}
                onChange={(e) => {
                  setSelectedMonth(
                    e.target.value ? Number(e.target.value) : null
                  );
                  setCurrentPage(1);
                }}
                className="w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Semua Bulan</option>
                {filterData?.months.map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>

              {/* Dropdown untuk Departemen (hanya untuk Manajer) */}
              {isManager && (
                <select
                  value={selectedDepartment || ""}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value || null);
                    setCurrentPage(1);
                  }}
                  className="w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Semua Departemen</option>
                  {filterData?.departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>
      )}

      {loadingTasks ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Memuat tugas...</p>
        </div>
      ) : errorTasks ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 text-lg">{errorTasks}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">
            Belum ada tugas yang diunggah.
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="overflow-x-auto rounded-lg border border-gray-200 flex-1">
            {groupKeys.map((groupKey) => (
              <div key={groupKey} className="mb-6">
                <h4 className="px-6 py-3 font-bold text-gray-700 w-full bg-gray-100 border-b border-gray-200">
                  {getGroupTitle(groupKey, groupBy)}
                </h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Judul Tugas
                      </th>
                      {isManager && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Karyawan
                        </th>
                      )}
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tautan URL
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Departemen
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Komentar
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedTasks[groupKey].map((task, index) => (
                      <tr
                        key={task.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {task.title}
                          </div>
                        </td>
                        {isManager && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {task.employee?.name || "N/A"}
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={task.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {task.link_url}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {task.department_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="max-w-xs truncate">
                            {task.comment || "Tidak ada komentar"}
                          </div>
                        </td>
                        {isManager && (
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleAccept(task.id)}
                              className="text-green-600 hover:text-green-800 mr-3"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleOpenRejectModal(task.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTimes />
                            </button>
                          </td>
                        )}
                        {!isManager && task.status === "Reject" && (
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => {
                                setFixTaskId(task.id);
                                setFixLink(task.link_url || "");
                                setFixModalOpen(true);
                              }}
                              className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition"
                            >
                              Edit
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* --- PAGINASI: Kontrol Paginasi --- */}
          {/* --- PAGINASI: Kontrol Paginasi --- */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-4">
            {/* Kontrol pagination */}
            <div className="flex items-center space-x-2">
              {/* Tombol Previous */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {/* Nomor halaman */}
              {renderPageNumbers()}

              {/* Tombol Next */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Tolak Tugas</h2>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Fix Modal */}
      {fixModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Perbaiki Tugas</h2>
            <input
              type="text"
              value={fixLink}
              onChange={(e) => setFixLink(e.target.value)}
              placeholder="Masukkan link perbaikan..."
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setFixModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleFixTask}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
