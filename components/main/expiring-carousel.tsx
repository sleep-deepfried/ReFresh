"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
        <p>Loading...</p>
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
                <div className="rounded-3xl bg-[#fafafa] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] p-4 h-44 w-32">
                  <div className="flex flex-col justify-between items-center">
                    <Image
                      src={`/assets/food/${item.foodname.toLowerCase()}.png`}
                      alt={item.foodname}
                      width={130}
                      height={130}
                      onError={
                        (e) => (e.currentTarget.src = "/assets/logo.png") // Fallback image
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
                    <p className="font-bold">{item.expiration}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      ) : (
        <p>No Expiration items found.</p>
      )}
    </div>
  );
}

export default ExpiringCarousel;
