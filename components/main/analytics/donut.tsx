"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import Image from "next/image";

const defaultColors = ["#FF610A", "#E97A35", "#E97A3580", "#FFD700", "#34A853"];

export default function DonutChart() {
  const [data, setData] = useState<
    { name: string; value: number; image: string; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/weekly-category");
        if (!res.ok) throw new Error("Failed to fetch categories");

        const { categories } = await res.json();

        // Generate chart data dynamically
        const newData = categories.map(
          (category: { name: string; value: number }, index: number) => ({
            name: category.name,
            value: category.value, // Now using actual count from the database
            image: `/assets/analytics/${category.name.toLowerCase()}-analytics.svg`, // Assuming images are named after categories
            color: defaultColors[index % defaultColors.length],
          })
        );

        setData(newData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) return <div>Failed to load data</div>;

  // Placeholder data for the skeleton
  const skeletonData = [
    { value: 35, color: "#E0E0E0" },
    { value: 25, color: "#EEEEEE" },
    { value: 20, color: "#F5F5F5" },
    { value: 15, color: "#FAFAFA" },
  ];

  return (
    <div>
      <div className="relative w-60 h-60 flex justify-center items-center">
        {loading ? (
          <>
            <PieChart width={240} height={240}>
              <Pie
                data={skeletonData}
                cx={120}
                cy={120}
                innerRadius={80}
                outerRadius={100}
                paddingAngle={0}
                cornerRadius={8}
                dataKey="value"
              >
                {skeletonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="absolute left-23 w-20 h-20 flex justify-center items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </>
        ) : (
          <>
            <PieChart width={240} height={240}>
              <Pie
                data={data}
                cx={120}
                cy={120}
                innerRadius={80}
                outerRadius={100}
                paddingAngle={0}
                cornerRadius={8}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            {data.length > 0 && (
              <div className="absolute left-23 w-20 h-20 flex justify-center items-center">
                <Image
                  src={
                    data.reduce((prev, current) =>
                      prev.value > current.value ? prev : current
                    ).image
                  }
                  width={80}
                  height={80}
                  alt="Top Category"
                />
              </div>
            )}
          </>
        )}
      </div>
      {loading ? (
        <div className="w-40 h-5 bg-gray-200 rounded-md mx-auto animate-pulse" />
      ) : (
        data.length > 0 && (
          <p className="text-center text-black">
            You&apos;ve been buying{" "}
            {
              data.reduce((prev, current) =>
                prev.value > current.value ? prev : current
              ).name
            }{" "}
            this week
          </p>
        )
      )}
    </div>
  );
}
