"use client";

import Image from "next/image";
import React, { useState } from "react";
import ItemList from "./item-list";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Remove({ onClose }: { onClose: () => void }) {
  const [currentItems, setCurrentItems] = useState<Item[]>([]);

  // Handle updating the current items from the ItemList component
  interface Item {
    name: string;
    quantity: number;
  }
  const handleItemsUpdate = (items: Item[]) => {
    setCurrentItems(items);
  };

  // Handle the confirm button click - send updated items to the backend
  const handleConfirm = async () => {
    try {
      // Filter out items with zero quantity
      const itemsToRemove = currentItems.filter((item) => item.quantity > 0);

      if (itemsToRemove.length === 0) {
        toast.warning("No items to remove", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // First toast to show that the request is being processed
      toast.info("Removing items from inventory...", {
        position: "top-right",
        autoClose: 2000,
      });

      // Create the query string for each item's quantity
      const queryParams = itemsToRemove
        .map(
          (item) => `quantity_${encodeURIComponent(item.name)}=${item.quantity}`
        )
        .join("&");

      const response = await fetch(
        `https://deciding-partly-cowbird.ngrok-free.app/remove?${queryParams}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "1",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove items");
      }

      const result = await response.json();
      console.log("Items removed successfully:", result);

      // Show success toast
      toast.success(
        `Successfully removed ${itemsToRemove.length} items from inventory!`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      // Additional toast after confirmation
      toast.info("Inventory updated", {
        position: "top-right",
        autoClose: 3000,
      });

      // Close the dialog after successful removal
      onClose();
    } catch (error) {
      console.error("Error removing items:", error);
      if (error instanceof Error) {
        toast.error(`Error removing items: ${error.message}`, {
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        toast.error("Error removing items", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  };

  const handleCancel = () => {
    toast.info("Operation cancelled", {
      position: "top-right",
      autoClose: 2000,
    });
    onClose();
  };

  return (
    <div className="fixed backdrop-blur-md h-full w-full top-0 left-0 justify-center items-center flex">
      {/* Place ToastContainer at the top level for proper positioning */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="relative h-[455px] w-[315px] bg-white rounded-3xl ">
        <Image
          src="/assets/grass.svg"
          alt="grass"
          width={160}
          height={155}
          className="absolute left-0"
        />
        <Image
          src="/assets/leaf.svg"
          alt="leaf"
          width={130}
          height={98}
          className="absolute bottom-13 right-0"
        />
        <div className="flex flex-col justify-center items-center h-full gap-5 z-20">
          <p className="font-bold text-xl">Remove</p>

          <div className="inset-shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-2xl h-[253px] w-[233px] bg-white">
            {/* Pass the onItemsUpdate prop to ItemList */}
            <ItemList onItemsUpdate={handleItemsUpdate} />
          </div>

          <div className="flex gap-5">
            <button
              className="font-medium text-sm border border-black px-6 py-px rounded-2xl shadow-md shadow-neutral-200"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="font-medium text-sm bg-[#FF610A] text-white px-6 py-2 rounded-2xl shadow-xl z-20"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
