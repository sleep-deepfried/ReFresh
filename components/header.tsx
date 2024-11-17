'use client'

import Image from "next/image";

import { IoIosNotifications } from "react-icons/io";


function Header() {

    return (
        <div className="py-4 px-7 rounded-b-3xl bg-[#e0e0e0] shadow-[3px_3px_3px_3px_#9f9f9f,-3px_-3px_3px_3px_#ffffff]">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-4">
                    <div className="rounded-full">
                            <Image src="/assets/user.png" alt="Profile" width={50} height={50}/>
                    </div>
                    <div>
                        <p>Hey, Vince!</p>
                        <p>How&apos;s your diet today</p> 
                    </div>
                </div>

                <IoIosNotifications className="text-4xl" />

                </div>

        </div>
    );
}

export default Header;