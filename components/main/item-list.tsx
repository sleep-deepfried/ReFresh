import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";

// ItemRow component for each item row
const ItemRow = ({ name, count, onIncrement, onDecrement }) => {
  return (
    <div className="flex justify-between px-10 items-center">
      <p className="text-base">
        {name}
      </p>
      <div className="flex items-center gap-2">
        <button 
          className="text-orange font-medium"
          onClick={onDecrement}
        >
          -
        </button>
        <p className="border border-orange rounded-md px-1.5 py-1">
          {count}
        </p>
        <button 
          className="text-orange font-medium"
          onClick={onIncrement}
        >
          +
        </button>
      </div>
    </div>
  );
};

// ItemList component to display all items and handle the detect function
const ItemList = ({ onItemsUpdate }) => {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDetect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Add the header to bypass ngrok warning
      const response = await fetch("https://deciding-partly-cowbird.ngrok-free.app/detect", {
        headers: {
          'ngrok-skip-browser-warning': '1'
        }
      });
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "success" && data.detected_items) {
        // Update the items state with the detected items
        const newItems = { ...items };
        
        data.detected_items.forEach(item => {
          newItems[item.name] = {
            name: item.name,
            count: item.quantity,
            confidence: item.confidence
          };
        });
        
        setItems(newItems);
        
        // Notify parent component about updated items
        if (onItemsUpdate) {
          const itemsArray = Object.values(newItems).map(item => ({
            name: item.name,
            quantity: item.count,
            confidence: item.confidence || 0
          }));
          onItemsUpdate(itemsArray);
        }
      } else {
        setError("No items detected or API returned unsuccessful status");
      }
    } catch (error) {
      console.error("Error detecting items:", error);
      setError(`Detection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = (name) => {
    setItems(prev => {
      const updated = {
        ...prev,
        [name]: {
          ...prev[name],
          count: prev[name].count + 1
        }
      };
      
      // Notify parent component about updated items
      if (onItemsUpdate) {
        const itemsArray = Object.values(updated).map(item => ({
          name: item.name,
          quantity: item.count,
          confidence: item.confidence || 0
        }));
        onItemsUpdate(itemsArray);
      }
      
      return updated;
    });
  };

  const handleDecrement = (name) => {
    setItems(prev => {
      const updated = {
        ...prev,
        [name]: {
          ...prev[name],
          count: Math.max(0, prev[name].count - 1)
        }
      };
      
      // Notify parent component about updated items
      if (onItemsUpdate) {
        const itemsArray = Object.values(updated).map(item => ({
          name: item.name,
          quantity: item.count,
          confidence: item.confidence || 0
        }));
        onItemsUpdate(itemsArray);
      }
      
      return updated;
    });
  };

  // For testing - add some sample items if needed
  const addSampleItems = () => {
    const sampleItems = {
      "Banana": { name: "Banana", count: 2, confidence: 95 },
      "Apple": { name: "Apple", count: 1, confidence: 93 },
      "Orange": { name: "Orange", count: 3, confidence: 91 },
      "Mango": { name: "Mango", count: 1, confidence: 90 },
      "Pineapple": { name: "Pineapple", count: 2, confidence: 92 }
    };
    
    setItems(sampleItems);
    
    // Notify parent component about updated items
    if (onItemsUpdate) {
      const itemsArray = Object.values(sampleItems).map(item => ({
        name: item.name,
        quantity: item.count,
        confidence: item.confidence
      }));
      onItemsUpdate(itemsArray);
    }
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
        <p className="text-center text-red-500 text-xs px-6">
          {error}
        </p>
      )}

      {/* Detect button */}
      <div className="flex self-center mt-2">
        <button 
          className="flex bg-[#404040] rounded-xl justify-center items-center self-center px-5 py-2 gap-3"
          onClick={handleDetect}
          disabled={loading}
        >
          <FaCamera className="text-white text-base" />
          <p className="text-sm text-white">{loading ? "Detecting..." : "Detect"}</p>
        </button>
      </div>
      
      {/* For development testing only - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={addSampleItems}
          className="text-xs text-gray-400 underline mt-2 self-center"
        >
          Add Sample Items (Dev Only)
        </button>
      )}
    </div>
  );
};

export default ItemList;