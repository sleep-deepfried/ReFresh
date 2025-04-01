"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function TrendsCarousel() {
  interface TrendItem {
    date_range: string;
    year: string;
    image_src: string;
    description: string;
  }

  const [trendItems, setTrendItems] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      try {
        setLoading(true);
        const response = await fetch("/api/food-trends");
        const data = await response.json();
        setTrendItems(data);
      } catch (error) {
        console.error("Error fetching food trends:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => {
    // Create an array of 4 items for the skeleton
    const skeletonItems = Array(4).fill(null);

    return (
      <div className="w-full">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            slidesToScroll: 1,
            loop: false,
            skipSnaps: false,
            dragFree: false,
          }}
        >
          <CarouselContent className="-ml-4 gap-4 mr-4">
            {skeletonItems.map((_, index) => (
              <CarouselItem key={index} className="pl-4 basis-32 min-w-32">
                <Card className="w-32 h-44 shadow-md animate-pulse">
                  <CardContent className="flex flex-col text-center items-center justify-center px-2 h-full">
                    <div className="h-4 bg-gray-200 w-3/4 mb-1 rounded"></div>
                    <div className="h-2 bg-gray-200 w-1/2 mb-3 rounded"></div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full my-1"></div>
                    <div className="h-2 bg-gray-200 w-full mt-3 rounded"></div>
                    <div className="h-2 bg-gray-200 w-4/5 mt-1 rounded"></div>
                    <div className="h-2 bg-gray-200 w-3/4 mt-1 rounded"></div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  };

  // Return the skeleton if loading
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full ">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          slidesToScroll: 1,
          loop: false,
          skipSnaps: false,
          dragFree: false,
        }}
      >
        <CarouselContent className="-ml-4 gap-4 mr-4">
          {trendItems.map((item, index) => (
            <CarouselItem key={index} className="pl-4 basis-32 min-w-32">
              <Card className="w-32 h-44 shadow-md">
                <CardContent className="flex flex-col text-center items-center justify-center px-2 h-full">
                  <p className="text-xs mb-1 text-[10px] font-semibold">
                    {item.date_range}
                    <br />
                    {item.year}
                  </p>
                  <Image
                    src={item.image_src}
                    alt="Food analytics visualization"
                    width={48}
                    height={48}
                    className="my-1"
                  />
                  <p className="text-[9px] mt-1">{item.description}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
