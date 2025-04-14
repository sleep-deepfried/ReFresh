"use client";

import { useEffect, useState } from "react";
import { BellIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";

type Notification = {
  id: number;
  message: string;
  createdAt: string;
  read: boolean;
  inventoryid?: string;
};

function formatNotificationDate(dateString: string) {
  try {
    // Convert PostgreSQL timestamp to ISO format
    const isoDate = dateString.replace(" ", "T") + "Z";
    const date = parseISO(isoDate);
    return format(date, "MMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
}

function SkeletonLoader() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-8 w-40 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="ml-auto h-5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl shadow animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-md w-1/4"></div>
              </div>
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // // Generate new notifications first
        // const generateResponse = await fetch("/api/generate-notification", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });

        // if (!generateResponse.ok) {
        //   throw new Error("Failed to generate notifications");
        // }

        // Then fetch all notifications
        const fetchResponse = await fetch("/api/notifications");
        if (!fetchResponse.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await fetchResponse.json();
        setNotifications(data);
        console.log(data);
        console.log(formatNotificationDate(data[0].createdAt));
      } catch (err) {
        console.error("Error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read if needed
      if (!notification.read) {
        const response = await fetch(`/api/notifications/${notification.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ read: true }),
        });

        if (!response.ok) {
          throw new Error("Failed to mark notification as read");
        }

        // Update local state to reflect the change
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
        );
      }

      // Navigate to inventory item if available
      if (notification.inventoryid) {
        router.push(`/inventory/${notification.inventoryid}`);
      }
    } catch (err) {
      console.error("Error handling notification click:", err);
      setError(
        err instanceof Error ? err.message : "Failed to process notification"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#f0f2f5] min-h-screen text-black">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-[#f0f2f5] min-h-screen text-black">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <BellIcon className="w-8 h-8 text-blue-600" />
          Notifications
        </h1>
        <div className="bg-white p-6 rounded-xl shadow-sm text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f0f2f5] min-h-screen text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <BellIcon className="w-8 h-8 text-blue-600" />
          Notifications
          {notifications.length > 0 && (
            <span className="ml-auto text-sm font-normal text-gray-500">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          )}
        </h1>

        {notifications.length === 0 ? (
          <div className="flex items-center justify-center bg-white p-6 rounded-xl shadow-sm text-gray-600">
            🎉 No notifications at the moment!
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-shadow cursor-pointer ${
                  !notification.read ? "border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`text-2xl ${
                      notification.read ? "text-gray-400" : "text-blue-500"
                    }`}
                  >
                    {notification.read ? "🔔" : "🔔"}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-base ${
                        notification.read ? "text-gray-600" : "font-semibold"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatNotificationDate(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
