// app/signup/page.tsx atau pages/signup.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRegister } from "../../hooks/useRegister";

export default function SignupPage() {
  const {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
  } = useRegister();

  return (
    <div className="min-h-screen flex font-satoshi">
      {/* Kiri */}
      <div className="w-1/2 flex flex-col p-10 bg-gray-100">
        <div className="mb-6">
          <Link href="/">
            <Image src="/logo_black.png" alt="Mercari Logo" width={150} height={50} />
          </Link>
        </div>
        <h1 className="text-4xl font-clash text-black mb-8 text-left">
          Incar dan miliki, kapan saja.
        </h1>
        <div className="flex justify-center flex-1">
          <div className="relative w-96 h-96">
            <Image
              src="/welcome.png"
              alt="Cute Characters"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>

      {/* Kanan */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-clash text-black mb-2 text-left">
            Sign up to continue
          </h2>
          <p className="text-sm text-gray-700 mb-6 text-left">
            To like or purchase an item or to chat with the seller, please create your account.
          </p>

          <button className="w-full bg-white border border-gray-300 text-black py-3 rounded-lg flex items-center justify-center mb-4">
            <Image src="/google.png" alt="Google Icon" width={20} height={20} className="mr-2" />
            Lanjutkan dengan Google
          </button>
          <button className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center mb-4">
            <Image src="/facebook.png" alt="Facebook Icon" width={20} height={20} className="mr-2" />
            Continue with Facebook
          </button>

          <div className="w-full flex items-center justify-center my-6 relative">
            <span className="border-t border-gray-300 w-full"></span>
            <span className="absolute bg-white px-3 text-gray-500 text-sm">or</span>
          </div>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">{success}</div>}

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Nickname</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your Nickname"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Use at least 8 characters"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                I agree to the Mercari{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service & Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              {loading ? "Processing..." : "Sign up"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-6 text-left">
            We keep your information safe. We never use your information.
          </p>

          <p className="text-sm text-gray-700 mt-4 font-satoshi text-left">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
