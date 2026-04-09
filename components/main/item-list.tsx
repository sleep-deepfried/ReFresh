import React, { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";

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
        <button type="button" className="text-orange font-medium" onClick={onDecrement}>
          -
        </button>
        <p className="border border-orange rounded-md px-1.5 py-1">{count}</p>
        <button type="button" className="text-orange font-medium" onClick={onIncrement}>
          +
        </button>
      </div>
    </div>
  );
};

interface ItemListProps {
  onItemsUpdate?: (
    items: { name: string; quantity: number; confidence: number }[]
  ) => void;
}

const ItemList: React.FC<ItemListProps> = ({ onItemsUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<{
    [key: string]: { name: string; count: number; confidence: number };
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notifyParent = (next: typeof items) => {
    if (onItemsUpdate) {
      const itemsArray = Object.values(next).map((item) => ({
        name: item.name,
        quantity: item.count,
        confidence: item.confidence || 0,
      }));
      onItemsUpdate(itemsArray);
    }
  };

  const runScanWithFile = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("image", file);

      const response = await fetch("/api/inventory/scan", {
        method: "POST",
        body: form,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const msg =
          payload?.error?.message ||
          payload?.message ||
          `Scan failed (${response.status})`;
        throw new Error(msg);
      }

      if (!payload?.success || !payload?.data?.items) {
        throw new Error("Unexpected response from scan API");
      }

      const detected = payload.data.items as {
        name: string;
        quantity: number;
        confidence: number;
      }[];

      if (detected.length === 0) {
        setError("No food items detected. Try better lighting or a clearer photo.");
        toast.warning("No food items detected in this photo.");
        return;
      }

      setItems((prev) => {
        const newItems = { ...prev };
        detected.forEach((item) => {
          const key = item.name.trim();
          newItems[key] = {
            name: key,
            count: item.quantity,
            confidence: item.confidence ?? 0,
          };
        });
        notifyParent(newItems);
        return newItems;
      });

      toast.success(`Detected ${detected.length} item(s).`);
    } catch (err) {
      console.error("Error scanning items:", err);
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("Scan failed.");
        toast.error("Scan failed.");
      }
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void runScanWithFile(file);
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
      notifyParent(updated);
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
      notifyParent(updated);
      return updated;
    });
  };

  return (
    <div className="flex flex-col py-7 gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFileSelected}
      />

      <div className="overflow-y-auto max-h-32 mb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {Object.keys(items).length > 0 &&
          Object.keys(items).map((key) => (
            <div key={key} className="mb-3 last:mb-1">
              <ItemRow
                name={items[key].name}
                count={items[key].count}
                onIncrement={() => handleIncrement(key)}
                onDecrement={() => handleDecrement(key)}
              />
            </div>
          ))}
        {Object.keys(items).length === 0 ? (
          <p className="text-center text-gray-400 px-4">
            {error ? "Could not complete scan" : "Take a photo to scan food"}
          </p>
        ) : null}
      </div>

      {error && (
        <p className="text-center text-red-500 text-xs px-6">{error}</p>
      )}

      <div className="flex self-center mt-2">
        <button
          type="button"
          className="flex bg-[#404040] rounded-xl justify-center items-center self-center px-5 py-2 gap-3"
          onClick={handlePickImage}
          disabled={loading}
        >
          <FaCamera className="text-white text-base" />
          <p className="text-sm text-white">
            {loading ? "Scanning..." : "Scan photo"}
          </p>
        </button>
      </div>
    </div>
  );
};

export default ItemList;
