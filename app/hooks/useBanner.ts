"use client";

import { useState, useEffect, useRef } from "react";

export function useBanner(bannerList: any[]) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const slideCount = isMobile
    ? bannerList.length
    : Math.ceil(bannerList.length / 2);

  const goToSlide = (index: number) => {
    if (containerRef.current) {
      if (index >= slideCount) {
        index = 0;
      }

      const container = containerRef.current;
      const slideWidth = container.scrollWidth / slideCount;

      container.scrollTo({
        left: slideWidth * index,
        behavior: "smooth",
      });

      setCurrentSlide(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % slideCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, slideCount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const slideWidth = container.scrollWidth / slideCount;
        const newSlide = Math.round(scrollLeft / slideWidth);

        if (newSlide >= 0 && newSlide < slideCount) {
          setCurrentSlide(newSlide);
        }
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile, slideCount]);

  const createSlidePairs = () => {
    const pairs = [];
    const totalPairs = Math.ceil(bannerList.length / 2);

    for (let i = 0; i < totalPairs; i++) {
      const leftBannerIndex = i * 2;
      const rightBannerIndex = i * 2 + 1;

      pairs.push({
        left: bannerList[leftBannerIndex],
        right:
          rightBannerIndex < bannerList.length
            ? bannerList[rightBannerIndex]
            : null,
      });
    }

    return pairs;
  };

  const slidePairs = isMobile ? null : createSlidePairs();

  return {
    currentSlide,
    isMobile,
    slideCount,
    containerRef,
    goToSlide,
    slidePairs,
  };
}
