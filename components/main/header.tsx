import Image from "next/image";
import { IoMdNotificationsOutline } from "react-icons/io";

import { auth } from "@/auth";
import { signOut } from "@/auth";

export default async function Header() {
  const session = await auth();

  if (!session?.user) {
    console.log("No user session found");
  }

  // Fallback image and name if no session
  const userImage = session?.user?.image || "/assets/user.png";
  const userName = session?.user?.name?.split(" ")[0] || "Guest";

  return (
    <div className="py-4 px-7 rounded-b-3xl bg-[#ffffff] shadow-[3px_3px_3px_3px_#c5c9cb,-3px_-3px_3px_3px_#ffffff] text-black">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row space-x-4">
          <form
            action={async () => {
              "use server";
              await signOut();
              window.location.href = "/sign-in";
            }}
          >
            <button className="rounded-full overflow-hidden" type="submit">
              <Image
                src={userImage}
                alt="Profile"
                width={60}
                height={60}
                className="object-cover border border-black rounded-full"
              />
            </button>
          </form>
          <div className="flex flex-col justify-center">
            <p className="text-2xl font-bold">Hey, {userName}!</p>
            <p className="text-sm">How&apos;s your diet today</p>
          </div>
        </div>

        <IoMdNotificationsOutline className="text-4xl" />
      </div>
    </div>
  );
}
