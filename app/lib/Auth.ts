import axios from "axios";
import { toast } from "react-toastify"; // Gunakan toast dari react-toastify

// Basis URL untuk storage backend
const BASE_URL = "http://localhost:8000";

// Fungsi untuk refresh token
const refreshToken = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BASE_URL}/api/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newToken = response.data.access_token;
    // Simpan token baru ke localStorage
    localStorage.setItem("token", newToken);

    console.log("Token baru berhasil diterima:", newToken);
    return newToken; // Kembalikan token baru
  } catch (error) {
    console.error("Error saat melakukan refresh token:", error);
    // Tampilkan toast error
    toast.error("Sesi telah berakhir. Silakan login kembali.", {
      position: "top-right",
      autoClose: 3000,
    });
    // Panggil logout dan redirect
    logoutUser();
    // Redirect ke halaman login
    window.location.href = "/login"; // Gunakan window.location.href untuk redirect
    throw new Error("Refresh token gagal. Silakan login kembali.");
  }
};

// Konfigurasikan interceptor axios untuk menangani token yang kadaluarsa
axios.interceptors.response.use(
  (response) => response, // Jika permintaan berhasil, lanjutkan
  async (error) => {
    // Jika error karena token kadaluarsa
    if (error.response && error.response.status === 401) {
      // Coba refresh token
      try {
        const newToken = await refreshToken();

        // Ulangi request yang gagal dengan token yang baru
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(error.config); // Kirim ulang permintaan dengan token baru
      } catch (refreshError) {
        // Jika refresh token gagal, sudah ditangani di refreshToken (toast + redirect)
        console.error("Gagal melakukan refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    // Jika bukan karena token kadaluarsa, lanjutkan dengan error lainnya
    return Promise.reject(error);
  }
);

// Fungsi untuk login dan menyimpan data ke localStorage
export const loginUser = async (email: string, password: string) => {
  try {
    // Panggil API login
    const response = await axios.post(`${BASE_URL}/api/login`, {
      email,
      password,
    });

    const data = response.data;

    // Log respons untuk debugging
    console.log("Respons dari server:", data);

    // Validasi data sebelum simpan
    if (!data.access_token || !data.user) {
      throw new Error("Respons login tidak valid");
    }

    // Simpan data ke localStorage
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.user.role || "user");
    localStorage.setItem("name", data.user.name || email.split("@")[0]);
    localStorage.setItem("id_user", data.user.id ? data.user.id.toString() : "");
    localStorage.setItem("email", data.user.email || "");
    localStorage.setItem("address", data.user.address || "");
    localStorage.setItem("phone_number", data.user.phone_number || "");
    localStorage.setItem("bio", data.user.bio || "");
    localStorage.setItem("created_at", data.user.created_at || "");

    // Validasi profile_picture dan buat URL lengkap
    let avatar = "/default-avatar.png";
    if (data.user.profile_picture) {
      if (data.user.profile_picture.startsWith("http")) {
        avatar = data.user.profile_picture;
      } else {
        avatar = `${BASE_URL}/storage/${data.user.profile_picture}`;
      }
    }
    localStorage.setItem("avatar", avatar);
    console.log("Avatar disimpan:", avatar);

    // Memicu event storage untuk update Navbar
    window.dispatchEvent(new Event("storage"));

    // Tampilkan toast sukses
    toast.success("Login berhasil!", {
      position: "top-right",
      autoClose: 2000,
    });

    return data; // Kembalikan data untuk pengecekan lebih lanjut
  } catch (error: any) {
    console.error("Error selama login:", error);
    // Tampilkan toast error
    toast.error(error.response?.data?.error || "Login gagal. Silakan coba lagi.", {
      position: "top-right",
      autoClose: 3000,
    });
    throw new Error(
      error.response?.data?.error || "Login gagal. Silakan coba lagi."
    );
  }
};

// Fungsi untuk logout dan hapus data dari localStorage
export const logoutUser = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.setItem("avatar", "/default-avatar.png");
    localStorage.removeItem("role");
    localStorage.removeItem("id_user");
    localStorage.removeItem("email");
    localStorage.removeItem("address");
    localStorage.removeItem("phone_number");
    localStorage.removeItem("bio");
    localStorage.removeItem("created_at");
    // Memicu event storage untuk update Navbar
    window.dispatchEvent(new Event("storage"));
    console.log("Logout berhasil, data localStorage dihapus");
    // Tampilkan toast sukses
    toast.success("Logout berhasil!", {
      position: "top-right",
      autoClose: 2000,
    });
  } catch (error) {
    console.error("Error selama logout:", error);
    // Tampilkan toast error
    toast.error("Gagal melakukan logout.", {
      position: "top-right",
      autoClose: 3000,
    });
  }
};