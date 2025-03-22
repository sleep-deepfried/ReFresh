'use client'

import Image from "next/image";
import React, { useState } from "react";
import ItemList from "./item-list"; // Import the new ItemList component

export default function Add({ onClose }: {onClose: () => void}) {
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
            const itemsToAdd = currentItems.filter(item => item.quantity > 0);
            
            if (itemsToAdd.length === 0) {
                alert("No items to add");
                return;
            }
            
            // Create the query string for each item's quantity
            const queryParams = itemsToAdd.map(item => 
                `quantity_${encodeURIComponent(item.name)}=${item.quantity}`
            ).join('&');
            
            const response = await fetch(`https://deciding-partly-cowbird.ngrok-free.app/add?${queryParams}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add items');
            }
            
            const result = await response.json();
            console.log('Items added successfully:', result);
            
            // Close the dialog after successful addition
            onClose();
        } catch (error) {
            console.error('Error adding items:', error);
            if (error instanceof Error) {
                alert(`Error adding items: ${error.message}`);
            } else {
                alert('Error adding items');
            }
        }
    };

    const handleCancel = async () => {
        try {
            // Call the clear endpoint
            await fetch("https://deciding-partly-cowbird.ngrok-free.app/clear", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1'
                }
            });
            
            // Close the dialog
            onClose();
        } catch (error) {
            console.error('Error clearing items:', error);
            // Still close the dialog even if clearing fails
            onClose();
        }
    };

    return(
        <div className="fixed backdrop-blur-md h-full w-full -top-10 left-0 justify-center items-center flex">
            <div className="relative h-[455px] w-[315px] bg-white rounded-3xl ">
                <Image src="/assets/cherry.svg" alt="cherry" width={112} height={84} className="absolute z-20 top-10"/>
                <Image src="/assets/watermellon.svg" alt="melon" width={130} height={98} className="absolute bottom-13 right-0"/>
                <div className="flex flex-col justify-center items-center h-full gap-5 z-20">
                    <p className="font-bold text-xl">Add</p>

                    <div className="inset-shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-2xl h-[253px] w-[233px] bg-white">
                        {/* Pass the onItemsUpdate prop to ItemList */}
                        <ItemList onItemsUpdate={handleItemsUpdate} />
                    </div>

                    <div className="flex gap-5">
                        <button className="font-medium text-sm border border-black px-6 py-px rounded-2xl shadow-md shadow-neutral-200"
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