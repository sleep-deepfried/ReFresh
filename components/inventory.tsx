import Image from "next/image";
import { inventoryData } from "@data/food-inventory";

function Inventory() {
  return (
    <div className="px-5 py-2">
      <div className="space-y-4">
        <p className="text-2xl font-semibold">Inventory</p>
        
        <div className="grid grid-cols-3 gap-4">
          {inventoryData.map((item) => (
            <div
              key={item.id}
              className="justify-between items-center bg-[#e0e0e0] rounded-xl shadow-[6px_6px_6px_#9f9f9f,-6px_-6px_6px_#ffffff] p-2"
            >
              <div>
                <Image
                  src={item.image}
                  alt={item.name.toLowerCase()}
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex justify-around">
                <p className="font-semibold">{item.name}</p>
                <div className="border border-orange px-1 rounded-md">
                  <p className="font-semibold">{item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Inventory;