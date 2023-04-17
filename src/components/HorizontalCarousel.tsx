import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { useState } from "react";

interface FadedTitleBodyCarouselSlideProps {
  title?: string;
  body?: string;
}

/**
 * Component for creating the faded background title/body slide elements
 * for the horizontal carousel
 * @param props
 * @returns
 */
export const FadedTitleBodyCarouselSlide = ({
  title,
  body,
}: FadedTitleBodyCarouselSlideProps) => {
  return (
    <>
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-grow"></div>
        <div className="bg-gradient-to-t from-white/100 to-gray-100/0 px-16 pb-8 pt-16 sm:pt-32">
          <h1 className="text-4xl font-bold text-black">{title}</h1>
          <p className="text-lg text-black">
            <i>{body}</i>
          </p>
        </div>
      </div>
    </>
  );
};

export interface HorizontalCarouselSlideProps {
  backgroundImage: string | undefined;
  body?: ReactElement;
}

/**
 * Carousel component
 * @param slides Slides to shuffle through
 * @param autoCycle The time (in seconds) to auto shuffle between slides. Undefined will be no auto shuffle.
 */
const HorizontalCarousel = ({
  slides,
  autoCycle,
}: {
  slides: HorizontalCarouselSlideProps[];
  autoCycle?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  /**
   * Advances to previous slide
   */
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  /**
   * Advances to next slide
   */
  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  /**
   * Go to specific slide
   * @param slideIndex index
   */
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  /**
   * Get background image url if present
   * @returns css url() or undefined if no backgroundImage specified.
   */
  const backgroundImageUrl = () => {
    const currentSlide = slides[currentIndex];

    if (currentSlide && currentSlide.backgroundImage) {
      return `url(${currentSlide.backgroundImage})`;
    }

    return;
  };

  useEffect(() => {
    if (autoCycle) {
      const intervalId = setInterval(() => {
        nextSlide();
      }, autoCycle * 1000);

      return () => clearInterval(intervalId);
    }
  });

  return (
    <div className="group relative m-auto h-96 w-full max-w-[1400px] py-4">
      <div
        style={{
          backgroundImage: backgroundImageUrl(),
        }}
        className="h-full w-full overflow-hidden rounded-2xl border border-gray-400 bg-cover bg-center drop-shadow-md duration-500"
      >
        {slides[currentIndex]?.body}
      </div>
      {/* Left Arrow */}
      <div className="absolute top-[50%] left-5 hidden -translate-x-0 translate-y-[-50%] cursor-pointer rounded-full bg-black/20 p-2 text-2xl text-white group-hover:block">
        <ChevronLeftIcon onClick={prevSlide} className="h-6 w-6" />
      </div>
      {/* Right Arrow */}
      <div className="absolute top-[50%] right-5 hidden -translate-x-0 translate-y-[-50%] cursor-pointer rounded-full bg-black/20 p-2 text-2xl text-white group-hover:block">
        <ChevronRightIcon onClick={nextSlide} className="h-6 w-6" />
      </div>
      <div className="top-4 flex justify-center py-2">
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className="cursor-pointer text-2xl"
          >
            <div
              className={`mx-1 h-2 w-2 rounded-full ${
                slideIndex === currentIndex ? "bg-gray-900" : "bg-gray-400"
              }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalCarousel;
