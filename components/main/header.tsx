import Image from "next/image";
import { IoIosNotifications } from "react-icons/io";

import { auth } from "@/auth";
import { signOut } from "@/auth"

export default async function Header() {
    const session = await auth()

    if (!session?.user) {
        console.log("No user session found");
    }


    // Fallback image and name if no session
    const userImage = session?.user?.image || "/assets/default-user.png";
    const userName = session?.user?.name || "Guest";

    return (
        <div className="py-4 px-7 rounded-b-3xl bg-[#e0e0e0] shadow-[3px_3px_3px_3px_#9f9f9f,-3px_-3px_3px_3px_#ffffff]">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-4">
                    <div className="rounded-full overflow-hidden">
                        <Image 
                            src={userImage} 
                            alt="Profile" 
                            width={50} 
                            height={50} 
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <p>Hey, {userName}!</p>
                        <p>How&apos;s your diet today</p> 
                    </div>

                    <form
                        action={async () => {
                            "use server"
                            await signOut();
                            window.location.href = "localhost:3000/sign-in";
                        }}
                        >
                        <button type="submit">Sign Out</button>
                    </form>
                </div>

                <IoIosNotifications className="text-4xl" />
            </div>
        </div>
    );
}