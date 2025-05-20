"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { loginUser } from "../../lib/Auth";

export default function LoginPage() {
  // Inisialisasi router
  const router = useRouter();

  // State untuk form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State untuk feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Tangani perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Tangani submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset feedback
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validasi input
    if (!formData.email || !formData.password) {
      setError("Email dan kata sandi wajib diisi");
      setLoading(false);
      return;
    }

    try {
      // Panggil fungsi loginUser
      await loginUser(formData.email, formData.password);

      // Tampilkan pesan sukses
      setSuccess("Login berhasil! Mengalihkan...");

      // Kosongkan form
      setFormData({
        email: "",
        password: "",
      });

      // Alihkan ke halaman utama setelah jeda
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-satoshi">
      {/* Kiri: Logo, Judul, Maskot */}
      <div className="w-1/2 flex flex-col p-10 bg-gray-100">
        <div className="mb-6">
          <Link href="/">
            <Image
              src="/logo_black.png"
              alt="Mercari Logo"
              width={150}
              height={50}
            />
          </Link>
        </div>
        <h1 className="text-4xl font-clash text-black mb-8 text-left">
          Incar dan miliki, kapan saja.
        </h1>
        <div className="flex justify-center flex-1">
          <div className="relative w-96 h-96">
            <Image
              src="/welcome.png"
              alt="Karakter Lucu"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>

      {/* Kanan: Form Login */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-clash text-black mb-2 text-left">
            Masuk ke Incaran
          </h2>
          <p className="text-sm text-gray-700 mb-6 text-left">
            Masukkan email dan kata sandi untuk mengakses akun Anda.
          </p>

          {/* Pesan feedback */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Tombol login sosial */}
          <button className="w-full bg-white border border-gray-300 text-black py-3 rounded-lg flex items-center justify-center mb-4">
            <Image
              src="/google.png"
              alt="Ikon Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Lanjutkan dengan Google
          </button>
          <button className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center mb-4">
            <Image
              src="/facebook.png"
              alt="Ikon Facebook"
              width={20}
              height={20}
              className="mr-2"
            />
            Lanjutkan dengan Facebook
          </button>

          {/* Pembatas */}
          <div className="w-full flex items-center justify-center my-6 relative">
            <span className="border-t border-gray-300 w-full"></span>
            <span className="absolute bg-white px-3 text-gray-500 text-sm">
              atau
            </span>
          </div>

          {/* Form */}
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email Anda"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan kata sandi Anda"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline block text-right mb-4"
            >
              Lupa kata sandi?
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              {loading ? "Sedang masuk..." : "Masuk"}
            </button>
          </form>

          {/* Teks footer */}
          <p className="text-xs text-gray-500 mt-6 text-left">
            Situs ini dilindungi oleh reCAPTCHA Enterprise dan{" "}
            <Link href="#" className="underline">
              Kebijakan Privasi
            </Link>{" "}
            serta{" "}
            <Link href="#" className="underline">
              Ketentuan Layanan
            </Link>{" "}
            Google berlaku.
          </p>
          <p className="text-bs text-gray-700 mt-4 text-left">
            Belum punya akun?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-bold"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}