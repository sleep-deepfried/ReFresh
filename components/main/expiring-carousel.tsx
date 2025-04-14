"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface ExpiryItem {
  id: number;
  foodname: string;
  foodtype: string;
  expiration: string;
  quantity: number;
}

interface ExpiryCarouselProps {
  slides?: ExpiryItem[]; // Optional prop
  options?: {
    slidesToShow?: number;
    loop?: boolean;
    // Other options you might want to support
  };
}

function SkeletonLoader({ slidesToShow = 3 }) {
  return (
    <div className="w-full">
      <div className="flex -ml-4">
        {Array.from({ length: slidesToShow }).map((_, index) => (
          <div key={index} className={`pl-4 flex-1`}>
            <div className="rounded-3xl bg-[#fafafa] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] py-4 px-3 h-44 w-32 animate-pulse">
              <div className="flex flex-col justify-around items-center h-full">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex flex-col w-full gap-2">
                  <div className="flex justify-between w-full items-center">
                    <div className="h-4 bg-gray-200 rounded w-14"></div>
                    <div className="h-4 bg-gray-200 rounded w-6"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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

  // Default configuration
  const slidesToShow = options?.slidesToShow || 3;

  return (
    <div className="py-3 px-4 z-10">
      {loading ? (
        <SkeletonLoader slidesToShow={slidesToShow} />
      ) : itemsToDisplay.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: options?.loop !== false, // Default to true
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {itemsToDisplay.map((item) => (
              <CarouselItem
                key={item.id}
                className={`pl-4 basis-1/${slidesToShow}`}
              >
                <div className="rounded-3xl bg-[#fafafa] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] py-4 px-3 h-44 w-32">
                  <div className="flex flex-col justify-around items-center h-full">
                    <Image
                      src={`/assets/food/${item.foodname.toLowerCase()}.png`}
                      alt={item.foodname}
                      width={70}
                      height={70}
                      onError={
                        (e) => (e.currentTarget.src = "/assets/logo.png") // Fallback image
                      }
                    />
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between font-bold w-full items-center">
                        <p className="text-sm">{item.foodname}</p>
                        <p className="px-[4px] border border-orange rounded-[4px] text-sm">
                          {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm text-red-600">
                        <p className="font-bold text-left">{item.expiration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <p>No Expiration items found.</p>
      )}
    </div>
  );
}

export default ExpiringCarousel;
