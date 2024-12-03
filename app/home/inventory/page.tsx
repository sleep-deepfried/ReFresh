"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/main/search-bar";
import { IoMdArrowRoundBack } from "react-icons/io";

interface InventoryItem {
    inventoryID: number;
    food_name: string;
    food_type: string;
    entry_date: string;
    best_before: string;
    confidence: number;
    quantity: number;
}

function Inventory() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
        try {
            const response = await fetch("/api/get-inventory");
            const data = await response.json();
            setInventory(data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchInventory();
    }, []);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center py-6 px-5 rounded-b-3xl bg-[#fafafa] shadow-[3px_3px_3px_3px_#9f9f9f,-3px_-3px_3px_3px_#ffffff] space-x-4">
                <Link href="/home">
                <IoMdArrowRoundBack className="text-3xl" />
                </Link>
                <p className="font-bold text-2xl">Current Inventory</p>
            </div>

            {/* Search Bar */}
            <SearchBar />

            {/* Inventory Items */}
            <div className="grid grid-cols-2 p-2 gap-6">
                {loading ? (
                <p>Loading...</p>
                ) : inventory.length > 0 ? (
                inventory.map((item) => (
                    <div
                        key={item.inventoryID}
                        className="rounded-3xl bg-[#fafafa] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] p-4"
                        >
                        <div className="flex flex-col justify-center items-center">
                            <Image
                            src={`/assets/${item.food_name.toLowerCase()}.png`}
                            alt={item.food_name}
                            width={130}
                            height={130}
                            onError={(e) =>
                                (e.currentTarget.src = "/assets/logo.png") // Fallback image
                            }
                            />
                            <div className="flex justify-between font-bold w-full">
                            <p className="text-lg">{item.food_name}</p>
                            <p className="px-[4px] border border-orange rounded-[4px]">
                                {item.quantity}
                            </p>
                            </div>
                        </div>
                        <div className="text-[7px] space-y-1">
                            <p>Stored at: {new Date(item.entry_date).toLocaleDateString()}</p>
                            <p>
                            Best Before: {new Date(`1970-01-01T${item.best_before}`).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))
                ) : (
                <p>No inventory items found.</p>
                )}
            </div>
        </div>
    );
}

export default Inventory;
