"use client";

import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Image from "next/image";

export default function FoodCategoryRadarChart() {
  const [categoryData, setCategoryData] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inventoryData, setInventoryData] = useState<
    { food_name: string; quantity?: number; best_before?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For insights
  const [topCategory, setTopCategory] = useState<string>("");
  const [secondCategory, setSecondCategory] = useState<string>("");
  const [mostStoredItem, setMostStoredItem] = useState<string>("");
  const [expiringItems, setExpiringItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch category data
        const categoryResponse = await fetch("/api/weekly-category");
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch category data");
        }
        const categoryResult = await categoryResponse.json();

        // Fetch inventory data
        const inventoryResponse = await fetch("/api/get-inventory");
        if (!inventoryResponse.ok) {
          throw new Error("Failed to fetch inventory data");
        }
        const inventoryResult: {
          food_name: string;
          quantity?: number;
          best_before?: string;
        }[] = await inventoryResponse.json();
        setInventoryData(inventoryResult);

        // Transform the category API response for the radar chart
        const transformedData = categoryResult.categories.map(
          (category: { name: string; value: number }) => ({
            subject:
              category.name.charAt(0).toUpperCase() + category.name.slice(1),
            value: category.value,
            fullMark:
              Math.max(
                ...categoryResult.categories.map(
                  (c: { value: number }) => c.value
                )
              ) * 1.2,
          })
        );

        setCategoryData(transformedData);

        // Process data for insights
        if (categoryResult.categories.length > 0) {
          // Sort categories by value (descending)
          const sortedCategories = [...categoryResult.categories].sort(
            (a, b) => b.value - a.value
          );

          // Get top and second categories
          if (sortedCategories.length > 0) {
            setTopCategory(sortedCategories[0].name);
          }
          if (sortedCategories.length > 1) {
            setSecondCategory(sortedCategories[1].name);
          }
        }

        // Process inventory data for insights
        if (inventoryResult.length > 0) {
          // Find most stored item (by quantity)
          const itemCounts: Record<string, number> = {};
          inventoryResult.forEach((item) => {
            if (!itemCounts[item.food_name]) {
              itemCounts[item.food_name] = 0;
            }
            itemCounts[item.food_name] += item.quantity || 1;
          });

          const mostStored = Object.entries(itemCounts).sort(
            (a, b) => b[1] - a[1]
          )[0][0];
          setMostStoredItem(mostStored);

          // Find items expiring in 2 days
          const today = new Date();
          const twoDaysFromNow = new Date();
          twoDaysFromNow.setDate(today.getDate() + 2);

          const soonExpiringItems = inventoryResult
            .filter((item) => {
              if (!item.best_before) return false;
              const expiryDate = new Date(item.best_before);
              return expiryDate <= twoDaysFromNow && expiryDate >= today;
            })
            .map((item) => item.food_name);

          setExpiringItems([...new Set(soonExpiringItems)]); // Remove duplicates
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse px-7">
      <div className="rounded-2xl bg-white shadow-md">
        {/* Radar chart skeleton */}
        <div className="h-48 w-full flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gray-200"></div>
        </div>

        {/* Insight skeleton */}
        <div className="flex items-center mt-4 px-12">
          <div className="bg-gray-200 h-6 w-6 rounded-full"></div>
          <div className="ml-2 h-3 bg-gray-200 rounded w-3/4"></div>
        </div>

        <hr className="mx-6 my-3" />

        {/* Weekly insights skeleton */}
        <div className="pb-4 px-6">
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="flex items-start gap-2">
            <div className="bg-gray-200 h-6 w-6 rounded"></div>
            <div className="w-full">
              <div className="h-2 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading data: {error}</p>
      </div>
    );
  }

  if (categoryData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">
          No food category data available for this week.
        </p>
      </div>
    );
  }

  return (
    <div className="px-7">
      <div className="rounded-2xl bg-white shadow-md ">
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="55%" outerRadius="70%" data={categoryData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis />
              <Tooltip formatter={(value) => [`${value} items`, "Quantity"]} />
              <Radar
                name="Food Items"
                dataKey="value"
                stroke="#38b2ac"
                fill="#4fd1c5"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex text-black items-center mt-4 px-12">
          <Image
            src="/assets/analytics/insight.svg"
            alt="insight"
            width={25}
            height={25}
          />
          <p className="text-[9px] text-center">
            Your food stack leans towards{" "}
            <span className="font-bold">{topCategory}</span> with a balanced mix
            of <span className="font-bold">{secondCategory}</span>.
          </p>
        </div>

        <hr className="mx-6 my-3" />

        <div className="text-black pb-4 px-6">
          <p className="font-medium mb-2 text-9px">
            This Week&apos;s Fridge Insights
          </p>
          <div className="flex items-start gap-2">
            <Image
              src={`/assets/${mostStoredItem.toLowerCase()}.png`}
              alt={mostStoredItem}
              width={25}
              height={25}
            />
            <div className="text-xs">
              <p>
                Most Stored Item:{" "}
                <span className="font-bold">{mostStoredItem}</span>
              </p>
              <p>
                Buying Trend: More{" "}
                <span className="font-bold">{topCategory} </span> this week
                compared to last
              </p>
              <p>
                <span className="text-red-500">Expiring soon:</span>{" "}
                <span className="font-bold">
                  {expiringItems.length > 0
                    ? expiringItems.join(", ")
                    : "No items expiring soon"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
