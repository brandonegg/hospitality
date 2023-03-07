import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import type { ReactElement} from 'react';
import { useState } from 'react';

interface HorizontalCarouselSlideProps {
    backgroundImage: string | undefined;
    body?: ReactElement;
}

/**
 * Carousel component
 * @param param0 
 */
const HorizontalCarousel = ({}) => {
    const slides: HorizontalCarouselSlideProps[] = [
        {
            backgroundImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2620&q=80',
            body: <>
                <div className='m-4'>
                    <h1 className='text-white font-bold'>Title</h1>
                    <p className='text-white'>body</p>
                </div>
            </>
        },
        {
            backgroundImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
        },
        {
            backgroundImage: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80',
        },
    
        {
            backgroundImage: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80',
        },
        {
            backgroundImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
        },
    ];

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
            className='w-full h-full rounded-2xl bg-center bg-cover duration-500 border border-gray-400 drop-shadow-md'
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