import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";

// ItemRow component for each item row
interface ItemRowProps {
  name: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
  name,
  count,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex justify-between px-10 items-center">
      <p className="text-base">{name}</p>
      <div className="flex items-center gap-2">
        <button className="text-orange font-medium" onClick={onDecrement}>
          -
        </button>
        <p className="border border-orange rounded-md px-1.5 py-1">{count}</p>
        <button className="text-orange font-medium" onClick={onIncrement}>
          +
        </button>
      </div>
    </div>
  );
};

// ItemList component to display all items and handle the detect function
interface ItemListProps {
  onItemsUpdate?: (
    items: { name: string; quantity: number; confidence: number }[]
  ) => void;
}

const ItemList: React.FC<ItemListProps> = ({ onItemsUpdate }) => {
  const [items, setItems] = useState<{
    [key: string]: { name: string; count: number; confidence: number };
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetect = async () => {
    setLoading(true);
    setError(null);

    try {
      // Add the header to bypass ngrok warning
      const response = await fetch(
        "https://deciding-partly-cowbird.ngrok-free.app/detect",
        {
          headers: {
            "ngrok-skip-browser-warning": "1",
          },
        }
      );

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success" && data.detected_items) {
        if (data.detected_items.length > 0) {
          // Items were detected successfully
          // Update the items state with the detected items
          const newItems = { ...items };

          data.detected_items.forEach(
            (item: { name: string; quantity: number; confidence: number }) => {
              newItems[item.name] = {
                name: item.name,
                count: item.quantity,
                confidence: item.confidence,
              };
            }
          );

          setItems(newItems);

          // Notify parent component about updated items
          if (onItemsUpdate) {
            const itemsArray = Object.values(newItems).map((item) => ({
              name: item.name,
              quantity: item.count,
              confidence: item.confidence || 0,
            }));
            onItemsUpdate(itemsArray);
          }

          // Show success toast
          toast.success(
            `Successfully detected ${data.detected_items.length} items!`
          );
        } else {
          // No items were detected
          setError("No items detected in the current frame");
          toast.warning(
            "No items detected. Try adjusting the camera position or lighting."
          );
        }
      } else if (data.status === "warning" && data.message) {
        // Handle the new warning status from our updated backend
        setError(data.message);
        toast.warning(data.message);
      } else {
        // General API error
        setError("No items detected or API returned unsuccessful status");
        toast.error("Detection failed. Please try again.");
      }
    } catch (error) {
      console.error("Error detecting items:", error);
      if (error instanceof Error) {
        setError(`Detection failed: ${error.message}`);
        toast.error(`Detection failed: ${error.message}`);
      } else {
        setError("Detection failed: An unknown error occurred");
        toast.error("Detection failed: An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = (name: string) => {
    setItems((prev) => {
      const updated = {
        ...prev,
        [name]: {
          ...prev[name],
          count: prev[name].count + 1,
        },
      };

      // Notify parent component about updated items
      if (onItemsUpdate) {
        const itemsArray = Object.values(updated).map((item) => ({
          name: item.name,
          quantity: item.count,
          confidence: item.confidence || 0,
        }));
        onItemsUpdate(itemsArray);
      }

      return updated;
    });
  };

  const handleDecrement = (name: string) => {
    setItems((prev) => {
      const updated = {
        ...prev,
        [name]: {
          ...prev[name],
          count: Math.max(0, prev[name].count - 1),
        },
      };

      // Notify parent component about updated items
      if (onItemsUpdate) {
        const itemsArray = Object.values(updated).map((item) => ({
          name: item.name,
          quantity: item.count,
          confidence: item.confidence || 0,
        }));
        onItemsUpdate(itemsArray);
      }

      return updated;
    });
  };

  return (
    <div className="flex flex-col py-7 gap-3">
      {/* Scrollable container for items - fixed height to show only 3 items */}
      <div className="overflow-y-auto max-h-32 mb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {Object.keys(items).length > 0 ? (
          Object.keys(items).map((key) => (
            <div key={key} className="mb-3 last:mb-1">
              <ItemRow
                name={items[key].name}
                count={items[key].count}
                onIncrement={() => handleIncrement(key)}
                onDecrement={() => handleDecrement(key)}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 px-4">
            {error ? "Error connecting to camera" : "No items detected yet"}
          </p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-center text-red-500 text-xs px-6">{error}</p>
      )}

      {/* Detect button */}
      <div className="flex self-center mt-2">
        <button
          className="flex bg-[#404040] rounded-xl justify-center items-center self-center px-5 py-2 gap-3"
          onClick={handleDetect}
          disabled={loading}
        >
          <FaCamera className="text-white text-base" />
          <p className="text-sm text-white">
            {loading ? "Detecting..." : "Detect"}
          </p>
        </button>
      </div>
    </div>
  );
};

export default ItemList;
