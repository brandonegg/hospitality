import { HeartIcon } from '@heroicons/react/24/solid';
import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import React from 'react';

import type { HorizontalCarouselSlideProps } from "../components/HorizontalCarousel";
import { FadedTitleBodyCarouselSlide } from "../components/HorizontalCarousel";
import HorizontalCarousel from "../components/HorizontalCarousel";
import NavigationBar from "../components/NavigationBar";
import indexContent from '../data/index.json';

/**
 * Main homepage react component.
 * @returns JSX
 */
const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const carouselSlides = indexContent.main_carousel.map(slideData => {
    const slideProps: HorizontalCarouselSlideProps = {
      backgroundImage: slideData.backgroundImage,
      body: <FadedTitleBodyCarouselSlide title={slideData.title} body={slideData.body} />
    }

    return slideProps;
  });

  return (
    <>
      <main className="max-w-[1400px] mx-auto">
        <div id='header-content' className="m-6">
          <h2 className="mb-6 text-4xl font-semibold flex items-center space-x-2"><HeartIcon className='w-9 h-9 text-red-600'/>
            <span>Hospitality</span>
          </h2>
          <NavigationBar session={sessionData}/>
        </div>
        <div id='main-content' className="mx-6">
          <HorizontalCarousel slides={carouselSlides} autoCycle={10}/>
        </div>
      </main>
    </>
  );
};

export default Home;
