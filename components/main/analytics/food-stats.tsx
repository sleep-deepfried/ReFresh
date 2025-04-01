"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Category {
  name: string;
  value: number;
}

export default function WeeklyFoodStats() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalMeals, setTotalMeals] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/weekly-category");
        const data = await response.json();
        if (data.categories) {
          // Sort categories by count in descending order and get the top 3
          const sortedCategories = data.categories
            .sort((a: Category, b: Category) => b.value - a.value)
            .slice(0, 3);

          const total = sortedCategories.reduce(
            (sum: number, cat: Category) => sum + cat.value,
            0
          );

          setTotalMeals(total);
          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error("Error fetching weekly categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl px-8 py-4 mx-8 -mt-24 text-black">
      <div className="flex flex-col space-y-3">
        {loading ? (
          // Skeleton loading UI
          <>
            {[1, 2, 3].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex justify-between items-center gap-12 animate-pulse"
              >
                <div
                  className={`bg-gray-200 rounded-md min-w-[64px] h-8 ${
                    index === 0 ? "h-10" : index === 1 ? "h-8" : "h-6"
                  }`}
                />
                <div className="flex gap-2 w-full">
                  <div className="bg-gray-200 rounded-md w-5 h-5" />
                  <div className="bg-gray-200 rounded-md w-full h-4" />
                </div>
              </div>
            ))}
          </>
        ) : (
          // Actual content
          categories.map((category, index) => {
            const percentage =
              totalMeals > 0
                ? ((category.value / totalMeals) * 100).toFixed(0)
                : 0;

            return (
              <div
                key={index}
                className="flex justify-between items-center gap-12"
              >
                <p
                  className={`font-medium text-center min-w-[64px] ${
                    index === 0
                      ? "text-[30px]"
                      : index === 1
                      ? "text-[24px]"
                      : "text-[16px]"
                  }`}
                >
                  {percentage}%
                </p>

                <div className="flex gap-2 w-full">
                  <Image
                    src={`/assets/analytics/${category.name.toLowerCase()}-icon.svg`}
                    alt={category.name}
                    width={20}
                    height={20}
                  />
                  <p className="text-[9px] text-center">
                    Your inventory included mostly{" "}
                    <span className="font-bold">{category.name}</span> this
                    week!
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
