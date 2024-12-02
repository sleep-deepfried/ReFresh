'use client';

import Image from 'next/image';
//@ts-expect-error library may need to update its package.json or typings.ts
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css'; 

interface FoodCategoryProps {
  slides: { src: string; alt: string }[]; // Array of slide objects
  options?: Record<string, any>; // Splide options
}

function FoodCategory({ slides, options }: FoodCategoryProps) {
    return (
        <div className="py-3 px-4">
            <Splide
                aria-label="Category Carousel"
                options={{
                type: 'loop',
                drag: 'free',
                snap: true,
                perPage: 3,
                arrows: false,
                pagination: false,
                gap: '1rem',
                autoWidth: true,
                ...options, // Allow overriding default options via props
                }}
                className="my-slider"
            >
                {slides.map((slide, index) => (
                <SplideSlide key={index}>
                    <Image 
                    src={slide.src} 
                    alt={slide.alt} 
                    width={300} 
                    height={300}
                    className="w-full h-auto" 
                    />
                </SplideSlide>
                ))}
            </Splide>
        </div>
    );
}

export default FoodCategory;
