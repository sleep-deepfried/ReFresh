'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
//@ts-expect-error library may need to update its package.json or typings.ts
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css'; 

interface ExpiryItem {
  id: number;
  foodname: string;
  foodtype: string;
  expiration: string;
  quantity: number;
}

interface ExpiryCarouselProps {
  slides?: ExpiryItem[]; // Optional prop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Record<string, any>; // Splide options
}

function ExpiringCarousel({ slides = [], options }: ExpiryCarouselProps) {
    const [expiration, setExpiration] = useState<ExpiryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpiration = async () => {
            try {
                const response = await fetch("/api/get-expiring");
                const data = await response.json();
                setExpiration(data);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpiration();
    }, []);

    // Use expiration data if available, otherwise use slides prop
    const itemsToDisplay = expiration.length > 0 ? expiration : slides;

    return (
        <div className="py-3 px-4 z-10">
            {loading ? (
                <p>Loading...</p>
            ) : itemsToDisplay.length > 0 ? (
                <Splide
                    aria-label="Expiration Carousel"
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
                    {itemsToDisplay.map((item) => (
                        <SplideSlide key={item.id}>
                            <div
                                className="rounded-3xl bg-[#fafafa] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] p-4"
                            >
                                <div className="flex flex-col justify-center items-center">
                                    <Image
                                        src={`/assets/${item.foodname.toLowerCase()}.png`}
                                        alt={item.foodname}
                                        width={130}
                                        height={130}
                                        onError={(e) =>
                                            (e.currentTarget.src = "/assets/logo.png") // Fallback image
                                        }
                                    />
                                    <div className="flex justify-between font-bold w-full">
                                        <p className="text-lg">{item.foodname}</p>
                                        <p className="px-[4px] border border-orange rounded-[4px]">
                                            {item.quantity}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-red-600">
                                    <p className='font-bold'>{item.expiration}</p>
                                </div>
                            </div>
                        </SplideSlide>
                    ))}
                </Splide>
            ) : (
                <p>No Expiration items found.</p>
            )}
        </div>
    );
}

export default ExpiringCarousel;