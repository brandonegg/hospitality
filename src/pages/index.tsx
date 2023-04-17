import { type NextPage } from "next";
import React from "react";

import type { HorizontalCarouselSlideProps } from "../components/HorizontalCarousel";
import { FadedTitleBodyCarouselSlide } from "../components/HorizontalCarousel";
import HorizontalCarousel from "../components/HorizontalCarousel";
import indexContent from "../data/index.json";

/**
 * Main homepage react component.
 * @returns JSX
 */
const Home: NextPage = () => {
  const carouselSlides = indexContent.main_carousel.map((slideData) => {
    const slideProps: HorizontalCarouselSlideProps = {
      backgroundImage: slideData.backgroundImage,
      body: (
        <FadedTitleBodyCarouselSlide
          title={slideData.title}
          body={slideData.body}
        />
      ),
    };

    return slideProps;
  });

  return (
    <>
      <main className="mx-auto max-w-[1400px]">
        <div id="main-content" className="mx-6">
          <HorizontalCarousel slides={carouselSlides} autoCycle={10} />
        </div>
      </main>
    </>
  );
};

export default Home;
