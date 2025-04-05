"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { RecommendationItem } from "@/types";
import { RecipeDetailsProvider } from "@/providers/recipe-details-context";
import RecipeDetailsModal from "@/components/main/[food_name]-recipe";
import Navbar from "@/components/main/navbar";
import RecommendationsSkeleton from "@/components/main/recommendation-skeleton";

const GeminiRecommendation = dynamic(
  () => import("@components/main/gemini-recomendation"),
  { ssr: false }
);

function Recommendation() {
  const [recommendation, setRecommendation] = useState<RecommendationItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = useMemo(() => ["All", "Breakfast", "Lunch", "Dinner"], []);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: RecommendationItem[] = [];
        if (activeCategory === "All") {
          // Fetch recommendations for multiple categories
          const categoryPromises = categories.slice(1).map(async (category) => {
            const response = await fetch(
              `https://gemini-refresh.duckdns.org/api/suggest-cuisines?category=${category}`
            );
            const categoryData = await response.json();
            return Array.isArray(categoryData) ? categoryData : [];
          });

          const categoryResults = await Promise.all(categoryPromises);
          // Flatten and take first 5 items
          data = categoryResults.flat().slice(0, 5);
        } else {
          // Fetch recommendations for specific category
          const response = await fetch(
            `https://gemini-refresh.duckdns.org/api/suggest-cuisines?category=${activeCategory}`
          );
          const responseData = await response.json();
          data = Array.isArray(responseData) ? responseData : [];
        }

        // Ensure data is an array
        setRecommendation(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [activeCategory, categories]);

  const recommendationItems = Array.isArray(recommendation)
    ? recommendation.map((item) => ({
        ...item,
        src:
          `/assets/${item.category?.toLowerCase() || "default"}.jpg` ||
          "/assets/recommended-default.jpg",
        alt: item.food_name || "Recommended Meal",
        title: item.food_name || "Unknown Meal",
        description: item.description || "No description available",
      }))
    : [];

  return (
    <RecipeDetailsProvider>
      <div className="overflow-x-hidden relative bg-white text-black">
        {/* Header */}
        <div className="relative flex px-6 pt-8 pb-20">
          <p className="text-4xl font-bold absolute top-10">
            Best Meals <br /> for you
          </p>
          <Image
            src="/assets/burger.png"
            alt="burger"
            width={350}
            height={200}
            className="absolute -right-2 top-0"
          />
        </div>

        <div className="flex pt-24 pb-4 px-2 text-sm items-center justify-around">
          {categories.map((category) => (
            <button
              key={category}
              className={`border-3 border-[#3A3B3C] py-2 px-5 rounded-3xl shadow-md ${
                activeCategory === category ? "bg-[#3A3B3C] text-white" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Recommended for you */}
        {loading ? (
          <RecommendationsSkeleton />
        ) : error ? (
          <div className="flex justify-center items-center p-8 text-red-500">
            <p>Error: {error}</p>
          </div>
        ) : recommendationItems.length > 0 ? (
          <GeminiRecommendation items={recommendationItems} />
        ) : (
          <div className="flex justify-center items-center p-8">
            <p>No {activeCategory} recommendations available.</p>
          </div>
        )}
        <RecipeDetailsModal />
      </div>
      <Navbar />
    </RecipeDetailsProvider>
  );
}

export default Recommendation;
