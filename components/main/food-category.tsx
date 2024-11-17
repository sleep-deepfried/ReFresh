'use client'

import Image from 'next/image';
//@ts-expect-error library may need to update its package.json or typings.ts
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css'; 

function FoodCategory() {
    return(
        <div className='py-3 px-4'>
            <Splide
                aria-label="My Favorite Images"
                options={{
                    type: 'loop',
                    drag: 'free',
                    snap: true,
                    perPage: 3,
                    arrows: false,
                    pagination: false,
                    gap: '1rem',
                    autoWidth: true, // This might be better than fixed width depending on your needs
                }}
                className="my-slider" // Optional: add custom class for styling
                >
                <SplideSlide>
                    <Image 
                    src="/assets/vegetable.svg" 
                    alt="Food" 
                    width={300} 
                    height={300}
                    className="w-full h-auto" // Optional: for responsive images
                    />
                </SplideSlide>
                <SplideSlide>
                    <Image 
                    src="/assets/fruit.svg" 
                    alt="Food" 
                    width={300} 
                    height={300}
                    className="w-full h-auto"
                    />
                </SplideSlide>
                <SplideSlide>
                    <Image 
                    src="/assets/meat.svg" 
                    alt="Food" 
                    width={300} 
                    height={300}
                    className="w-full h-auto"
                    />
                </SplideSlide>
            </Splide>
        </div>
    );
}

export default FoodCategory;