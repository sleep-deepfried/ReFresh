"use client";

import { useState, useEffect } from "react";

export default function RecentActivity() {
  interface Activity {
    id: string;
    food_category: string;
    food_item: string;
    activity_date: string;
    quantity: number;
  }

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        const response = await fetch("/api/recent-activity");

        if (!response.ok) {
          throw new Error("Failed to fetch recent activity");
        }

        const data = await response.json();
        setActivities(data);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    }

    fetchRecentActivity();
  }, []);

  // Format date to DD MMM YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Loading skeleton component
  const ActivitySkeleton = () => (
    <div className="rounded-3xl bg-gray-50 shadow-lg py-4 px-8">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex flex-row justify-between items-center py-4 border-b border-gray-200 last:border-b-0"
        >
          <div className="flex flex-col">
            <div className="bg-gray-200 h-3 w-16 rounded mb-1 animate-pulse"></div>
            <div className="bg-gray-200 h-3 w-12 rounded animate-pulse"></div>
          </div>

          <div className="bg-gray-200 h-4 w-20 rounded animate-pulse"></div>

          <div className="flex flex-col items-center">
            <div className="bg-gray-200 h-3 w-16 rounded mb-1 animate-pulse"></div>
            <div className="bg-gray-200 h-3 w-8 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="px-8">
        <h1 className="text-2xl font-bold">Recent Activity</h1>
        <ActivitySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8">
        <h1 className="text-2xl font-bold">Recent Activity</h1>
        <div className="rounded-3xl bg-red-50 shadow-lg p-4 text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold pb-5 px-4">Recent Activity</h1>
      <div className="px-8">
        <div className="rounded-3xl bg-gray-50 shadow-lg py-4 px-8">
          {activities.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No recent activities found
            </p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-row justify-between items-center py-4 border-b border-gray-200 last:border-b-0"
              >
                <p className="text-gray-500 text-xs font-semibold">
                  Added to <br />
                  {activity.food_category}
                </p>

                <p className="font-bold text-black">{activity.food_item}</p>

                <div className="flex flex-col items-center">
                  <p className="text-gray-500 text-xs">
                    {formatDate(activity.activity_date)}
                  </p>
                  <p className="text-orange-500">+{activity.quantity}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
