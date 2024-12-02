'use client'

import Image from "next/image";
import { IoIosAddCircle, IoIosRemoveCircle} from "react-icons/io";

function AddRemoveCard(){
    return(
        <div className="p-5 space-y-6">
            <div className="flex rounded-xl bg-[#ffffff] shadow-[3px_3px_3px#c5c9cb,-3px_-3px_3px#ffffff] p-4 justify-between relative">
                <div className="space-y-3">
                    <div className="">
                        <p className="font-bold text-xl">Complete your daily <br />nutrition</p>
                    </div>
                    <div className="flex text-white font-semibold text-sm gap-3">
                        <button className="flex items-center bg-orange rounded-xl space-x-1 min-w-24 justify-center py-2">
                            <IoIosAddCircle/>
                            <p>Add</p>
                        </button>
                        <button className="flex items-center bg-orange rounded-xl space-x-1 min-w-24 justify-center py-2">
                            <IoIosRemoveCircle />
                            <p>Remove</p>
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-0 right-5">
                    <Image src="/assets/holding-phone.svg" alt="alt" width={75} height={30} />
                </div>
            </div>
            <div className="flex justify-between text-lg font-bold">
                <button className=" flex rounded-xl bg-[#ffffff] shadow-[3px_3px_3px#c5c9cb,-3px_-3px_3px#ffffff] py-2 pl-3 pr-8 justify-between relative"
                        onClick={() =>window.location.href = "/home/inventory"}
                >
                    <div className=""   
                    >
                        <p className="text-left">What&apos;s in your <br /> fridge?</p>
                        <div className="absolute -right-3 -bottom-4">
                            <Image src="/assets/inventory.svg" alt="alt" width={140} height={100} />
                        </div>
                    </div>
                </button>
                <div className="flex flex-col gap-7">
                    <button className="flex rounded-xl bg-[#ffffff] shadow-[3px_3px_3px#c5c9cb,-3px_-3px_3px#ffffff] py-2 pl-3 pr-16 justify-between relative"
                            onClick={() =>window.location.href = "/home/recommedations"}
                    >
                        <p>Your daily <br />meal</p>
                        <div className="absolute right-0 bottom-0">
                            <Image src="/assets/daily-meal.svg" alt="alt" width={60} height={50} />
                        </div>
                    </button>
                    <button className="flex rounded-xl bg-[#ffffff] shadow-[3px_3px_3px#c5c9cb,-3px_-3px_3px#ffffff] py-2 pl-3 pr-16 relative">
                        <p>Health <br/> Tracker</p>
                        <div className="absolute right-0">
                            <Image src="/assets/health.svg" alt="alt" width={55} height={50} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRemoveCard