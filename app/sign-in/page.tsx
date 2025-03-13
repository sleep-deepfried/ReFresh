"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";

function SignIn() {
    return (
        <div className="flex flex-col justify-center space-y-20 min-h-screen">
        {/* Back Button */}
        <div className="absolute top-5 left-3 block text-orange text-4xl">
            <Link href={"/get-started"}>
            <IoIosArrowBack />
            </Link>
        </div>

        {/* Login Form */}
        <div className="flex flex-col items-center text-center space-y-8">
            <p className="text-5xl font-bold">Login to your account</p>
            <div className="space-y-3 w-full px-10">
            {/* Username Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaUser />
                </div>
                <input
                className="pl-10 pr-4 rounded-lg bg-[#e0e0e0] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] w-full text-gray-400 h-10 outline-hidden focus:outline-hidden focus:text-black"
                placeholder="Username"
                />
            </div>

            {/* Password Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <MdPassword />
                </div>
                <input
                type="password"
                className="pl-10 pr-4 rounded-lg bg-[#e0e0e0] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] w-full text-gray-400 h-10 outline-hidden focus:outline-hidden"
                placeholder="Password"
                />
            </div>
            </div>

            {/* Log In Button */}
            <div className="text-center">
                <button className="bg-orange px-16 py-3 text-white rounded-lg text-xl mx-5">
                    Log In
                </button>
            </div>
        </div>

        {/* Social Sign-In */}
        <div className="space-y-3">
            <div className="flex justify-center items-center text-gray-400">
                <hr className="w-1/3 h-0.5 bg-linear-to-r from-transparent to-gray-400" />
                <p className="px-2 text-sm">Or continue with</p>
                <hr className="w-1/3 h-0.5 bg-linear-to-l from-transparent to-gray-400" />
            </div>

            <div className="space-y-3 flex flex-col items-center">
                <div className="flex space-x-4 text-lg text-[#fafafc] font-semibold">
                    {/* Google Sign-In */}
                    <button
                    onClick={() => signIn("google", { callbackUrl: "/home" })} // Sign in with Google
                    className="flex justify-center items-center min-w-40 py-2 bg-orange rounded-lg space-x-2"
                    >
                    <Image src="/assets/google.svg" alt="Google" width={30} height={30} />
                    <p>Google</p>
                    </button>

                    {/* Facebook Sign-In (Placeholder) */}
                    <button
                    className="flex justify-center items-center min-w-40 py-2 bg-orange rounded-lg space-x-2"
                    onClick={() => alert("Facebook sign-in coming soon!")}
                    >
                    <Image src="/assets/facebook.svg" alt="Facebook" width={30} height={30} />
                    <p>Facebook</p>
                    </button>
                </div>
            </div>
        </div>

        {/* Registration Link */}
        <div className="text-center">
            <p>
            Not a Member?{" "}
            <Link href="/login/sign-up" className="text-orange">
                Register Now
            </Link>
            </p>
        </div>
        </div>
    );
}

export default SignIn;
