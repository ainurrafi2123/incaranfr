"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, ShoppingCart, User, Menu } from "lucide-react";
import { logoutUser } from "../lib/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NavbarButtonProps {
  user: boolean; // Status login pengguna
  pathname: string; // Pathname untuk deteksi halaman
}

const NavbarButton: React.FC<NavbarButtonProps> = ({ user, pathname }) => {
  // Tentukan teks dan tujuan berdasarkan pathname
  const ismypagePage = pathname === "/mypage";
  const buttonText = ismypagePage ? "List an Items" : "Sell";
  const destination = user
    ? ismypagePage
      ? "/mypage/listing"
      : "/mypage/listing/create"
    : "/login";

  // Tentukan apakah navbar putih untuk styling
  const isWhiteNavbar = pathname === "/mypage" || pathname.startsWith("/search");

  return (
    <Link href={destination}>
      <button
        className={`${
          isWhiteNavbar ? "bg-primary text-white" : "bg-white text-primary"
        } px-4 h-10 rounded-md font-bold hover:bg-blue-500 text-sm ml-1 sm:ml-3`}
      >
        {buttonText}
      </button>
    </Link>
  );
};

export default function Navbar() {
  // State untuk data user dan status login
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  // State untuk kontrol visibilitas dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Dapatkan pathname untuk deteksi halaman
  const pathname = usePathname();

  // Basis URL untuk storage
  const BASE_URL = "http://localhost:8000";

  // Fungsi untuk memeriksa status login dari localStorage
  const checkLoginStatus = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const name = localStorage.getItem("name") || "User";
        let avatar = localStorage.getItem("avatar") || "/default-avatar.png";
        // Pastikan avatar valid
        if (avatar && !avatar.startsWith("http") && !avatar.startsWith("/")) {
          avatar = `${BASE_URL}/storage/${avatar}`;
        }
        setUser({ name, avatar });
        console.log("User loaded from localStorage:", { name, avatar });
      } else {
        setUser(null);
        setIsDropdownOpen(false); // Tutup dropdown saat logout
        console.log("No user found in localStorage");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setUser(null);
      setIsDropdownOpen(false);
    }
  };

  // Jalankan saat komponen dimuat dan dengarkan event storage
  useEffect(() => {
    checkLoginStatus(); // Periksa saat pertama kali dimuat
    window.addEventListener("storage", checkLoginStatus);
    // Tutup dropdown saat klik di luar
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".mypage-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Fungsi untuk toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fungsi untuk handle logout
  const handleLogout = () => {
    try {
      logoutUser();
      setUser(null);
      setIsDropdownOpen(false); // Tutup dropdown setelah logout
      toast.success("Berhasil logout!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Gagal logout, coba lagi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Validasi avatar untuk Image
  const getValidAvatar = (avatar: string) => {
    if (avatar && (avatar.startsWith("http") || avatar.startsWith("/"))) {
      return avatar;
    }
    return "/default-avatar.png";
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 ${
        pathname === "/mypage" || pathname.startsWith("/search")
          ? "bg-white"
          : "bg-primary"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left section - Logo, Hamburger & Search */}
          <div className="flex items-center flex-grow lg:flex-grow-0">
            {/* Hamburger - Mobile Only */}
            <button
              className={`${
                pathname === "/mypage" || pathname.startsWith("/search")
                  ? "text-gray-900"
                  : "text-white"
              } lg:hidden mr-2`}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo with Link to Homepage */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src={
                    pathname === "/mypage" || pathname.startsWith("/search")
                      ? "/Logo_black.png"
                      : "/Logo.png"
                  }
                  alt="Logo"
                  width={130}
                  height={48}
                  className="object-contain"
                />
              </Link>
            </div>
          </div>

          {/* Search Bar - Hidden on smallest screens, visible and expanding from md up */}
          <div className="hidden md:flex mx-4 lg:mx-6 flex-grow max-w-xl">
            <div className="flex items-center bg-gray-100 rounded-full h-10 px-4 w-full">
              <input
                type="text"
                placeholder="Cari apa saja"
                className="flex-grow bg-transparent focus:outline-none text-sm font-medium text-gray-900"
              />
              <Search className="w-5 h-5 text-gray-500 ml-2" />
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center font-satoshi">
            {/* Desktop: Get Info, Sign in / Log in */}
            <div className="hidden lg:flex items-center space-x-5 mr-4">
              <a
                href="#"
                className={`${
                  pathname === "/mypage" || pathname.startsWith("/search")
                    ? "text-gray-900"
                    : "text-white"
                } text-bs font-medium hover:underline whitespace-nowrap`}
              >
                Get Info
              </a>
              {!user && (
                <>
                  <Link
                    href="/signup"
                    className={`${
                      pathname === "/mypage" || pathname.startsWith("/search")
                        ? "text-gray-900"
                        : "text-white"
                    } text-bs font-medium hover:underline whitespace-nowrap`}
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className={`${
                      pathname === "/mypage" || pathname.startsWith("/search")
                        ? "text-gray-900"
                        : "text-white"
                    } text-bs font-medium hover:underline whitespace-nowrap`}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Garis Batas */}
            <div className="hidden md:flex items-center">
              <span
                className={`border-r-2 h-6 mx-2 ${
                  pathname === "/mypage" || pathname.startsWith("/search")
                    ? "border-gray-900"
                    : "border-white"
                }`}
              ></span>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Mobile user icon untuk belum login */}
              {!user && (
                <button
                  className={`${
                    pathname === "/mypage" || pathname.startsWith("/search")
                      ? "text-gray-900"
                      : "text-white"
                  } lg:hidden`}
                >
                  <User className="w-6 h-6" />
                </button>
              )}

              {/* Bell dan Cart */}
              <button className="relative flex items-center justify-center h-10 w-10">
                <Bell
                  className={`w-5 h-5 ${
                    pathname === "/mypage" || pathname.startsWith("/search")
                      ? "text-gray-900"
                      : "text-white"
                  }`}
                />
              </button>
              <button className="relative flex items-center justify-center h-10 w-10">
                <ShoppingCart
                  className={`w-5 h-5 ${
                    pathname === "/mypage" || pathname.startsWith("/search")
                      ? "text-gray-900"
                      : "text-white"
                  }`}
                />
              </button>

              {/* mypage picture (circle) ketika login */}
              {user && (
                <div className="relative flex items-center justify-center h-10 w-10 mypage-dropdown">
                  <button onClick={toggleDropdown}>
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={getValidAvatar(user.avatar)}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        unoptimized
                        onError={(e) =>
                          (e.currentTarget.src = "/default-avatar.png")
                        }
                      />
                    </div>
                  </button>
                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute top-12 right-0 bg-white shadow-lg rounded-md py-2 w-32 z-50">
                      <Link
                        href="/mypage"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tombol Sell/Listing Items menggunakan NavbarButton */}
            <NavbarButton user={!!user} pathname={pathname} />
          </div>
        </div>

        {/* Mobile Search - Full width below the main navbar */}
        <div className="mt-3 md:hidden">
          <div className="flex items-center bg-gray-100 rounded-full h-10 px-4">
            <input
              type="text"
              placeholder="Cari apa saja"
              className="flex-grow bg-transparent focus:outline-none text-sm font-medium text-gray-900"
            />
            <Search className="w-5 h-5 text-gray-500 ml-2" />
          </div>
        </div>
      </div>

      {/* Toast Container untuk notifikasi */}
      <ToastContainer />
    </nav>
  );
}