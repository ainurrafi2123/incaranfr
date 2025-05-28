"use client";

import Image from "next/image";
import { useBanner } from "../hooks/useBanner";
import {
  Shirt,
  Smartphone,
  Gamepad2,
  Lamp,
  Baby,
  Palette,
  ClipboardList,
  PawPrint,
} from "lucide-react";

const banners = {
  banner1: require("@/public/banner1.jpg").default,
  banner2: require("@/public/banner2.jpg").default,
  banner3: require("@/public/banner3.jpg").default,
  banner4: require("@/public/banner4.jpg").default,
};

const categories = [
  { icon: <Shirt size={24} />, label: "Men" },
  { icon: <Smartphone size={24} />, label: "Electronics" },
  { icon: <Gamepad2 size={24} />, label: "Gaming" },
  { icon: <Lamp size={24} />, label: "Home" },
  { icon: <Baby size={24} />, label: "Kids" },
  { icon: <Palette size={24} />, label: "Handmade" },
  { icon: <ClipboardList size={24} />, label: "Office" },
  { icon: <PawPrint size={24} />, label: "Pet" },
];

export default function BannerWithCategories() {
  const bannerList = Object.values(banners);
  type SlidePair = { left: any; right?: any }; // Replace 'any' with StaticImageData from 'next/image' if available

  const {
    currentSlide,
    isMobile,
    slideCount,
    containerRef,
    goToSlide,
    slidePairs,
  }: {
    currentSlide: number;
    isMobile: boolean;
    slideCount: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
    goToSlide: (index: number) => void;
    slidePairs: SlidePair[] | null;
  } = useBanner(bannerList);

  return (
    <div className="relative">
      {/* Categories Section */}
      <section className="w-full bg-transparent">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-6 items-center justify-center">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-sm text-gray-800 hover:text-black transition cursor-pointer"
              >
                <div className="mb-1">{cat.icon}</div>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section
        className={`w-full relative ${
          isMobile ? "h-[290px]" : "h-[385px]"
        } flex flex-col items-start overflow-hidden bg-transparent`}
      >
        <div className="max-w-screen-xl mx-auto px-4 mt-4 relative flex flex-col items-start w-full h-full">
          <div
            ref={containerRef}
            className={`flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full ${
              isMobile ? "h-[130px]" : "h-[220px]"
            } scrollbar-hide`}
            style={{ scrollSnapType: "x mandatory" }}
          >
            {isMobile
              ? bannerList.map((banner, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full relative overflow-hidden rounded-lg h-full cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <Image
                      src={banner}
                      alt={`Banner ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  </div>
                ))
              : slidePairs!.map((pair, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="flex-shrink-0 w-full relative overflow-hidden rounded-lg h-[220px] flex gap-4"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <div className="w-1/2 h-full relative overflow-hidden rounded-lg cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                      <Image
                        src={pair.left}
                        alt={`Banner ${slideIndex * 2 + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        priority
                      />
                    </div>
                    {pair.right ? (
                      <div className="w-1/2 h-full relative overflow-hidden rounded-lg cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                        <Image
                          src={pair.right}
                          alt={`Banner ${slideIndex * 2 + 2}`}
                          fill
                          style={{ objectFit: "cover" }}
                          priority
                        />
                      </div>
                    ) : (
                      <div className="w-1/2 h-full"></div>
                    )}
                  </div>
                ))}
          </div>
        </div>

        <div
          className={`absolute ${
            isMobile ? "bottom-2 md:bottom-4" : "top-[20rem] md:top-[21rem]"
          } bg-black bg-opacity-50 px-4 py-2 rounded-full flex space-x-2 md:right-6 md:translate-x-0 right-1/2 translate-x-1/2`}
        >
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentSlide
                  ? "bg-blue-400"
                  : "bg-gray-600 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
