"use client";

import Image from "next/image";
import React, { useState } from "react";
import ItemList from "./item-list";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Item {
  name: string;
  quantity: number;
  confidence?: number;
}

export default function Add({ onClose }: { onClose: () => void }) {
  const [currentItems, setCurrentItems] = useState<Item[]>([]);
  const [listKey, setListKey] = useState(0);

  const handleItemsUpdate = (items: Item[]) => {
    setCurrentItems(items);
  };

  const handleConfirm = async () => {
    try {
      const itemsToAdd = currentItems.filter((item) => item.quantity > 0);

      if (itemsToAdd.length === 0) {
        toast.warning("No items to add", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      toast.info("Adding items to inventory...", {
        position: "top-right",
        autoClose: 2000,
      });

      const response = await fetch("/api/inventory/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemsToAdd.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            confidence: item.confidence ?? 0.5,
            food_type: "General",
          })),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const msg =
          payload?.error?.message ||
          payload?.message ||
          "Failed to add items";
        throw new Error(msg);
      }

      toast.success(
        `Successfully added ${itemsToAdd.length} item(s) to inventory!`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      toast.info("Inventory updated", {
        position: "top-right",
        autoClose: 3000,
      });

      onClose();
    } catch (error) {
      console.error("Error adding items:", error);
      if (error instanceof Error) {
        toast.error(`Error adding items: ${error.message}`, {
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        toast.error("Error adding items", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  };

  const handleCancel = () => {
    setListKey((k) => k + 1);
    setCurrentItems([]);
    toast.info("Cancelled", {
      position: "top-right",
      autoClose: 2000,
    });
    onClose();
  };

  return (
    <div className="fixed backdrop-blur-md h-full w-full top-0 left-0 justify-center items-center flex">
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
          src="/assets/cherry.svg"
          alt="cherry"
          width={112}
          height={84}
          className="absolute z-20 top-10"
        />
        <Image
          src="/assets/watermellon.svg"
          alt="melon"
          width={130}
          height={98}
          className="absolute bottom-13 right-0"
        />
        <div className="flex flex-col justify-center items-center h-full gap-5 z-20">
          <p className="font-bold text-xl">Add</p>

          <div className="inset-shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-2xl h-[253px] w-[233px] bg-white">
            <ItemList key={listKey} onItemsUpdate={handleItemsUpdate} />
          </div>

          <div className="flex gap-5">
            <button
              type="button"
              className="font-medium text-sm border border-black px-6 py-px rounded-2xl shadow-md shadow-neutral-200"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
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
