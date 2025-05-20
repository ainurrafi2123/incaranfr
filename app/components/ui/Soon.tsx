"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown.seconds > 0) {
        setCountdown({ ...countdown, seconds: countdown.seconds - 1 });
      } else if (countdown.minutes > 0) {
        setCountdown({
          ...countdown,
          minutes: countdown.minutes - 1,
          seconds: 59,
        });
      } else if (countdown.hours > 0) {
        setCountdown({
          ...countdown,
          hours: countdown.hours - 1,
          minutes: 59,
          seconds: 59,
        });
      } else if (countdown.days > 0) {
        setCountdown({
          ...countdown,
          days: countdown.days - 1,
          hours: 23,
          minutes: 59,
          seconds: 59,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-yellow-100 p-4 mt-">
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <Image
              src="/Logo_black.png"
              alt="Logo"
              width={150}
              height={32}
              priority
              className="mb-4"
            />

            <span className="inline-block text-xs font-clash tracking-wider text-secondary mb-3">
              — COMING SOON
            </span>

            <h1 className="text-3xl font-bold text-primary font-satoshi mb-4">
              We're Crafting<br />
              Something <span className="text-accent">Special</span>
            </h1>

            <p className="font-inter text-sm text-gray-500 mb-6">
              Our new website is on its way. Sign up to be the first to know
              when we launch and receive exclusive early access.
            </p>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xl font-bold font-satoshi">
                  {countdown.days}
                </div>
                <div className="text-xs font-inter text-gray-500">Days</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xl font-bold font-satoshi">
                  {countdown.hours}
                </div>
                <div className="text-xs font-inter text-gray-500">Hours</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xl font-bold font-satoshi">
                  {countdown.minutes}
                </div>
                <div className="text-xs font-inter text-gray-500">Min</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xl font-bold font-satoshi">
                  {countdown.seconds}
                </div>
                <div className="text-xs font-inter text-gray-500">Sec</div>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="relative mb-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-full border-2 border-amber-200 focus:border-amber-400 focus:outline-none font-inter text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-accent text-white font-medium px-4 rounded-full transition-colors duration-300 font-inter text-sm"
              >
                Notify Me
              </button>
            </form>
            {isSubmitted && (
              <p className="text-green-600 mt-1 font-inter text-xs">
                Thank you for subscribing!
              </p>
            )}

            <p className="text-xs text-gray-500 mt-2 font-inter">
              *We promise not to spam you.
            </p>
          </div>

          {/* Design Elements */}
          <div className="relative h-32 mt-6 mb-2 overflow-hidden">
            <div className="absolute top-0 left-0 bg-white rounded-lg shadow-md p-3 w-32 animate-float">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-amber-200 mr-2"></div>
                <div>
                  <div className="h-2 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="flex space-x-1 mb-2">
                <div className="h-8 bg-amber-100 rounded flex-1"></div>
                <div className="h-8 bg-amber-100 rounded flex-1"></div>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 bg-white rounded-lg shadow-md p-3 w-36 animate-float-delayed">
              <div className="h-12 bg-gradient-to-r from-amber-200 to-amber-400 rounded mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-3 pt-2">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                  stroke="#B45309"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 3.00029C22.0424 3.67577 20.9821 4.1924 19.86 4.53029C19.2577 3.8378 18.4573 3.34698 17.567 3.12422C16.6767 2.90145 15.7395 2.95749 14.8821 3.28474C14.0247 3.612 13.2884 4.19469 12.773 4.95401C12.2575 5.71332 11.9877 6.61263 12 7.53029V8.53029C10.2426 8.57586 8.50127 8.1861 6.93101 7.39574C5.36074 6.60537 4.01032 5.43893 3 4.00029C3 4.00029 -1 13.0003 8 17.0003C5.94053 18.3983 3.48716 19.0992 1 19.0003C10 24.0003 21 19.0003 21 7.50029C20.9991 7.22174 20.9723 6.94388 20.92 6.67029C21.9406 5.66378 22.6608 4.39322 23 3.00029Z"
                  stroke="#B45309"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"
                  stroke="#B45309"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 11.3701C16.1234 12.2023 15.9812 13.0523 15.5937 13.7991C15.2062 14.5459 14.5931 15.1515 13.8416 15.5297C13.0901 15.908 12.2384 16.0397 11.4077 15.906C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1903 8.22768 13.4229 8.09402 12.5923C7.96035 11.7616 8.09202 10.91 8.47028 10.1584C8.84854 9.40691 9.45414 8.7938 10.2009 8.4063C10.9477 8.0188 11.7977 7.87665 12.63 8.00006C13.4789 8.12594 14.2648 8.52152 14.8716 9.12836C15.4785 9.73521 15.8741 10.5211 16 11.3701Z"
                  stroke="#B45309"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 6.5H17.51"
                  stroke="#B45309"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.5401 6.42C22.4213 5.94541 22.1794 5.51057 21.8387 5.15941C21.4981 4.80824 21.0708 4.55318 20.6001 4.42C18.8801 4 12.0001 4 12.0001 4C12.0001 4 5.12008 4 3.40008 4.46C2.92933 4.59318 2.50206 4.84824 2.16143 5.19941C1.8208 5.55057 1.57887 5.98541 1.46008 6.46C1.14577 8.20556 0.991302 9.97631 1.00008 11.75C0.988802 13.537 1.14327 15.3213 1.46008 17.08C1.59104 17.5398 1.83839 17.9581 2.17823 18.2945C2.51806 18.6308 2.9389 18.8738 3.40008 19C5.12008 19.46 12.0001 19.46 12.0001 19.46C12.0001 19.46 18.8801 19.46 20.6001 19C21.0708 18.8668 21.4981 18.6118 21.8387 18.2606C22.1794 17.9094 22.4213 17.4746 22.5401 17C22.8544 15.2544 23.0068 13.4837 23.0001 11.71C23.0114 9.92306 22.8569 8.13881 22.5401 6.38"
                  stroke="#B45309"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.75 15.02L16 11.75L9.75 8.48001V15.02Z"
                  stroke="#B45309"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}