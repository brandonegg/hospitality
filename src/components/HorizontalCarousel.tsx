import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import type { ReactElement} from 'react';
import { useState } from 'react';

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
export const FadedTitleBodyCarouselSlide = ({title, body}: FadedTitleBodyCarouselSlideProps) => {
    return <>
        <div className='h-full flex flex-col overflow-hidden'>
            <div className="flex-grow"></div>
            <div className="px-16 py-8 bg-gradient-to-t from-white/75 to-gray-100/0">
            <h1 className='text-black text-4xl font-bold'>{title}</h1>
            <p className='text-lg text-black'><i>{body}</i></p>
            </div>
        </div>
    </>
}

export interface HorizontalCarouselSlideProps {
    backgroundImage: string | undefined;
    body?: ReactElement;
}

/**
 * Carousel component
 * @param param0 
 */
const HorizontalCarousel = ({slides}: {slides: HorizontalCarouselSlideProps[]}) => {
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
    }

    return (
    <div className='max-w-[1400px] h-96 w-full m-auto py-4 relative group'>
        <div
            style={{
                backgroundImage: backgroundImageUrl(),
            }}
            className='w-full h-full rounded-2xl overflow-hidden bg-center bg-cover duration-500 border border-gray-400 drop-shadow-md'
        >
            {slides[currentIndex]?.body}
        </div>
        {/* Left Arrow */}
        <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <ChevronLeftIcon onClick={prevSlide} className="h-6 w-6" />
        </div>
        {/* Right Arrow */}
        <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <ChevronRightIcon onClick={nextSlide} className="h-6 w-6" />
        </div>
        <div className='flex top-4 justify-center py-2'>
        {slides.map((slide, slideIndex) => (
            <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className='text-2xl cursor-pointer'
            >
            <div className='mx-1 w-2 h-2 rounded-full bg-gray-900'></div>
            </div>
        ))}
        </div>
    </div>
    );
}

export default HorizontalCarousel
