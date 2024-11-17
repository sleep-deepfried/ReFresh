import Image from "next/image";
import Link from "next/link";

function GetStarted(){
    return(
        <div className="flex flex-col items-center justify-around h-screen pb-12 ">
            <div className="">
                <Image src="/assets/fridge.jpg" alt="logo" width={300} height={300} />
            </div>
            <div className="flex flex-col items-center gap-9">
                <div className="flex flex-col items-center">
                    <Image src="/assets/logo.png" alt="logo" width={200} height={200} />
                    <p className="text-gray-400">You&apos;re Guide To, Fresh Health Choices</p> 
                </div>
                <button className="bg-orange px-10 py-3 text-white rounded-lg text-xl">
                    <Link href={"/login/sign-up"}>
                        Get Started
                    </Link>
                </button>
            </div>
        </div>
    )
}

export default GetStarted;