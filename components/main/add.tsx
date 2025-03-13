import Image from "next/image";

import { FaCamera } from "react-icons/fa";

export default function Add({ onClose }: {onClose: () => void}) {

    return(
        <div className="fixed backdrop-blur-md h-full w-full -top-10 left-0 justify-center items-center flex">
            <div className="relative h-[455px] w-[315px] bg-white rounded-3xl ">
                <Image src="/assets/cherry.svg" alt="cherry" width={112} height={84} className="absolute z-20 top-10"/>
                <Image src="/assets/watermellon.svg" alt="melon" width={130} height={98} className="absolute bottom-13 right-0"/>
                <div className="flex flex-col justify-center items-center h-full gap-5 z-20">
                    <p className="font-bold text-xl">Add</p>

                    <div className="inset-shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-2xl h-[253px] w-[233px] bg-white">
                        <div className="flex flex-col py-7 gap-3 ">
                            <div className="flex justify-between px-10 items-center">
                                <p className="text-base">
                                    Eggplant
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="text-orange font-medium">
                                        -
                                    </button>
                                    <p className="border border-orange rounded-md px-1.5 py-1">
                                        1
                                    </p>
                                    <button className="text-orange font-medium">
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between px-10 items-center">
                                <p className="text-base text-center">
                                    Eggplant
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="text-orange font-medium">
                                        -
                                    </button>
                                    <p className="border border-orange rounded-md px-1.5 py-1">
                                        1
                                    </p>
                                    <button className="text-orange font-medium">
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between px-10 items-center">
                                <p className="text-base">
                                    Eggplant
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="text-orange font-medium">
                                        -
                                    </button>
                                    <p className="border border-orange rounded-md px-1.5 py-1">
                                        1
                                    </p>
                                    <button className="text-orange font-medium">
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex self-center">
                                <button className="flex bg-[#404040] rounded-xl justify-center items-center self-center px-5 py-2 gap-3">
                                    <FaCamera className="text-white text-base" />
                                    <p className="text-sm text-white">Detect</p>
                                </button>
                            </div>
                            
                        </div>

                        
                    </div>

                    <div className="flex gap-5">
                        <button className="font-medium text-sm border border-black px-6 py-px rounded-2xl shadow-md shadow-neutral-200"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button className="font-medium text-sm bg-[#FF610A] text-white px-6 py-2 rounded-2xl shadow-xl ">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}