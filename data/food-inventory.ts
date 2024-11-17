export interface InventoryItem {
    id: number;
    name: string;
    quantity: number;
    image: string;
}

export const inventoryData: InventoryItem[] = [
    {
        id: 1,
        name: "Apple",
        quantity: 5,
        image: "/assets/apple.png"
    },
    {
        id: 2,
        name: "Orange",
        quantity: 3,
        image: "/assets/orange.png"
    },
    {
        id: 3,
        name: "Banana",
        quantity: 4,
        image: "/assets/banana.png"
    },
    // Add more items as needed
];