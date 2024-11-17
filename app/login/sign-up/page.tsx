import Image from "next/image";

import { FaUser, FaCheckCircle} from "react-icons/fa";
import { MdEmail, MdPassword  } from "react-icons/md";




function SignUp(){
    return (
        <div className="flex flex-col justify-center space-y-20 min-h-screen">
            <div className="flex flex-col items-center text-center gap-2">
                <p className="text-6xl font-bold">
                        Create an account
                </p>
                <div className="space-y-3">
                    <p className="text-gray-400">Sign up With</p>
                    <div className="flex space-x-4 text-lg text-[#fafafc] font-semibold">
                        <button className="flex justify-center items-center min-w-40  py-2 bg-orange rounded-lg space-x-2">
                            <Image src="/assets/google.svg" alt="Google" width={30} height={30} />
                            <p>Google</p>
                        </button>
                        <button className="flex justify-center items-center min-w-40 py-2 bg-orange rounded-lg space-x-2">
                            <Image src="/assets/facebook.svg" alt="Facebook" width={30} height={30} />
                            <p>Facebook</p>
                        </button>
                    </div>
                </div>
            </div>
            <div className="px-5 space-y-5">
                <div className="space-y-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FaUser />
                        </div>
                        <input 
                            className="pl-10 pr-4 rounded-lg bg-[#e0e0e0] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] w-full text-gray-400 h-10 outline-none focus:outline-none focus:text-black"
                            placeholder="Username"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <MdEmail />
                        </div>
                        <input 
                            className="pl-10 pr-4 rounded-lg bg-[#e0e0e0] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] w-full text-gray-400 h-10 outline-none focus:outline-none"
                            placeholder="Email"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <MdPassword />
                        </div>
                        <input 
                            className="pl-10 pr-4 rounded-lg bg-[#e0e0e0] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] w-full text-gray-400 h-10 outline-none focus:outline-none"
                            placeholder="Password"
                        />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-gray-400">
                            <FaCheckCircle />
                            <p>At least 8 characters</p>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                            <FaCheckCircle />
                            <p>At least 1 number</p>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                            <FaCheckCircle />
                            <p>Both upper and lowercase letters</p>
                        </div>
                    </div>

                </div> 

                <div className="text-center">
                    <button className="bg-orange px-16 py-3 text-white rounded-lg text-xl mx-5">
                        Register
                    </button>
                </div>
            </div>

        </div>
    );
}

export default SignUp;