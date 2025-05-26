import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to validate tokens

// Basis URL untuk storage backend
const BASE_URL = "http://localhost:8000";

// Fungsi untuk refresh token
const refreshToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

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

    const { access_token, user } = response.data;

    // Validate token
    if (!access_token) {
      throw new Error("No access_token in refresh response");
    }

    // Decode token to verify user ID
    const decodedToken = jwtDecode(access_token);
    if (!decodedToken.sub) {
      throw new Error("Invalid token: No sub claim found");
    }

    // Simpan token baru ke localStorage
    localStorage.setItem("token", access_token);

    // Update user data if provided
    if (user) {
      localStorage.setItem("role", user.role || "user");
      localStorage.setItem("name", user.name || user.email?.split("@")[0] || "");
      localStorage.setItem("id_user", user.id ? user.id.toString() : "");
      localStorage.setItem("email", user.email || "");
      localStorage.setItem("address", user.address || "");
      localStorage.setItem("phone_number", user.phone_number || "");
      localStorage.setItem("bio", user.bio || "");
      localStorage.setItem("created_at", user.created_at || "");

      // Handle avatar
      let avatar = "/default-avatar.png";
      if (user.profile_picture) {
        avatar = user.profile_picture.startsWith("http")
          ? user.profile_picture
          : `${BASE_URL}/storage/${user.profile_picture}`;
      }
      localStorage.setItem("avatar", avatar);
      console.log("Avatar disimpan:", avatar);
    }

    console.log("Token baru berhasil diterima:", access_token);
    console.log("User data updated:", user);

    // Memicu event storage untuk update UI
    window.dispatchEvent(new Event("storage"));

    return access_token;
  } catch (error) {
    console.error("Error saat melakukan refresh token:", error);
    toast.error("Sesi telah berakhir. Silakan login kembali.", {
      position: "top-right",
      autoClose: 3000,
    });
    logoutUser();
    window.location.href = "/login";
    throw new Error("Refresh token gagal. Silakan login kembali.");
  }
};

// Konfigurasikan interceptor axios untuk menangani token yang kadaluarsa
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const newToken = await refreshToken();
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(error.config);
      } catch (refreshError) {
        console.error("Gagal melakukan refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Fungsi untuk login dan menyimpan data ke localStorage
export const loginUser = async (email: string, password: string) => {
  try {
    // Clear existing localStorage to prevent stale data
    logoutUser();

    // Panggil API login
    const response = await axios.post(`${BASE_URL}/api/login`, {
      email,
      password,
    });

    const data = response.data;
    console.log("Respons dari server:", data);

    // Validasi data
    if (!data.access_token || !data.user) {
      throw new Error("Respons login tidak valid");
    }

    // Decode token to verify user ID
    const decodedToken = jwtDecode(data.access_token);
    if (!decodedToken.sub || decodedToken.sub !== data.user.id.toString()) {
      throw new Error("Token user ID does not match response user ID");
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
      avatar = data.user.profile_picture.startsWith("http")
        ? data.user.profile_picture
        : `${BASE_URL}/storage/${data.user.profile_picture}`;
    }
    localStorage.setItem("avatar", avatar);
    console.log("Avatar disimpan:", avatar);

    // Memicu event storage untuk update UI
    window.dispatchEvent(new Event("storage"));

    toast.success("Login berhasil!", {
      position: "top-right",
      autoClose: 2000,
    });

    return data;
  } catch (error: any) {
    console.error("Error selama login:", error);
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
    // Clear all localStorage
    localStorage.clear();
    // Set default avatar
    localStorage.setItem("avatar", "/default-avatar.png");
    // Memicu event storage untuk update UI
    window.dispatchEvent(new Event("storage"));
    console.log("Logout berhasil, semua data localStorage dihapus");

    toast.success("Logout berhasil!", {
      position: "top-right",
      autoClose: 2000,
    });
  } catch (error) {
    console.error("Error selama logout:", error);
    toast.error("Gagal melakukan logout.", {
      position: "top-right",
      autoClose: 3000,
    });
  }
};