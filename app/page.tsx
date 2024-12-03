import Image from "next/image";
import Link from "next/link";

function GetStarted(){
    return(
        <div className="flex flex-col items-center justify-center min-h-screen space-y-32">
            <div className="">
                <Image src="/assets/fridge.svg" alt="logo" width={250} height={200} />
            </div>
            <div className="flex flex-col items-center gap-9">
                <div className="flex flex-col items-center">
                    <Image src="/assets/logo.svg" alt="logo" width={200} height={200} />
                    <p className="text-gray-400">You&apos;re Guide To, Fresh Health Choices</p> 
                </div>
                <button className="bg-orange px-10 py-3 text-white rounded-lg text-xl">
                    <Link href={"/sign-in"}>
                        Get Started
                    </Link>
                </button>
            </div>
        </div>
    )
}

export default GetStarted;