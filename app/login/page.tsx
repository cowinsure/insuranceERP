"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaMobile, FaUnlockAlt, FaSpinner } from "react-icons/fa";
import { toast, Toaster } from "sonner";
// import AOS from "aos";
// import "aos/dist/aos.css";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import useApi from "@/hooks/use_api";
import { useAuth } from "@/core/context/AuthContext";

interface LoginProps {
  logoSrc: string;
  backgroundImages?: {
    top: string;
    bottom: string;
  };
  apiUrl: string;
  redirectUrl?: string;
}

const Login: React.FC<LoginProps> = ({
  logoSrc,
  backgroundImages,
  apiUrl,
  redirectUrl = "/dashboard",
}) => {
  const router = useRouter();
  const { login } = useAuth();
  const { post } = useApi();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [phoneError, setPhoneError] = useState<string | boolean>(false);
  const [passwordError, setPasswordError] = useState<string | boolean>(false);

 

  // New function with improved error handling
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    //("Function from error-fixing");
    // Reset errors
    setPhoneError(false);
    setPasswordError(false);

    let valid = true;

    if (!phone) {
      setPhoneError("Phone number cannot be empty.");
      valid = false;
    } else if (!/^[0-9]{11}$/.test(phone)) {
      setPhoneError("Please enter a valid 11-digit phone number.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password cannot be empty.");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await post("v1/auth/public/login/", {
        mobile_number: phone,
        password,
      });

      const { role: userId, access_token: accessToken } = response.data;

      await login(userId, phone, accessToken);
      toast.success("Login successful!");
      router.push(redirectUrl);
      setIsLoading(false);
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.data?.message;

        if (status === 400 || status === 401) {
          toast.error("Invalid phone number or password.");
          setPhoneError(" ");
          setPasswordError(" ");
        } else if (status >= 500) {
          toast.error(message);
        } else {
          toast.error(message || "Something went wrong.");
        }
      } else if (error.request) {
        toast.error("Network error! Please try again later.");
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-3 relative bg-blue-50 overflow-hidden text-gray-700">
      <div className="row-span-3 w-full flex items-center justify-center">
        {/* <>
          {backgroundImages?.top && (
            <Image
              src={backgroundImages.top}
              alt="Top Wave"
              className="absolute -top-6 -right-14 scale-[250%] md:-top-24 md:-right-28 md:scale-[200%] lg:scale-100 lg:-top-40 lg:-right-44 xl:-top-64 xl:-right-54 w-1/3 z-0"
              width={500}
              height={500}
            />
          )}
          {backgroundImages?.bottom && (
            <Image
              src={backgroundImages.bottom}
              alt="Bottom Wave"
              className="absolute -bottom-10 -left-5 scale-[220%] md:-bottom-24 md:-left-28 md:scale-[200%] lg:scale-100 lg:-bottom-40 lg:-left-44 xl:-bottom-64 xl:-left-50 w-1/3 z-0 opacity-60"
              width={500}
              height={500}
            />
          )}
        </> */}

        {/* logo */}
        {/* <div className="absolute top-5 left-1 md:left-5 flex items-center space-x-2 z-10">
          <div className="w-36 md:w-48 flex justify-center mb-6">
            <Image
              src={logoSrc || ""}
              alt="Logo"
              width={50}
              height={50}
              className="object-contain h-[60px] w-auto"
              priority
              unoptimized
            />
          </div>
        </div> */}

        <div className="px-8 lg:pt-22 md:p-8 rounded w-full max-w-md z-10">
          <h1 className="text-3xl md:text-4xl font-bold underline text-blue-800 mb-6 text-center">
            Login 
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative" data-aos="fade-in" data-aos-delay="100">
                <label
                  htmlFor="phone"
                  className="block text-lg font-bold text-blue-500"
                >
                  Phone
                </label>
                <span className="absolute inset-y-0 top-8 left-0 pl-3 flex items-center pointer-events-none text-blue-800">
                  <FaMobile />
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setPhone(val);
                    if (val.trim() !== "") setPhoneError(false);
                  }}
                  className={`mt-1 w-full px-9 py-2 border-2 rounded-md font-semibold text-base shadow-md ${
                    phoneError
                      ? "border-red-600 bg-red-50"
                      : "border-[#0E5829] bg-white"
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
              {phoneError && (
                <p className="text-red-600 text-sm mt-1">
                  {typeof phoneError === "string"
                    ? phoneError
                    : "Invalid phone number."}
                </p>
              )}
            </div>

            <div>
              <div className="relative" data-aos="fade-in" data-aos-delay="200">
                <label
                  htmlFor="password"
                  className="block text-lg font-bold text-blue-500"
                >
                  Password
                </label>
                <span className="absolute inset-y-0 top-8 left-0 pl-3 flex items-center pointer-events-none text-blue-800">
                  <FaUnlockAlt />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.trim() !== "") setPasswordError(false);
                  }}
                  className={`mt-1 w-full px-9 py-2 border-2 rounded-md font-semibold text-base shadow-md ${
                    passwordError
                      ? "border-red-600 bg-red-50"
                      : "border-[#0E5829] bg-white"
                  }`}
                  placeholder="Enter your password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-11.5 right-3 text-blue-700 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">
                  {typeof passwordError === "string"
                    ? passwordError
                    : "Invalid password."}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-blue-300 bg-blue-800 hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              data-aos="fade-in"
              data-aos-delay="300"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : "Login"}
            </button>
          </form>

          <div
            className="space-y-3 lg:space-y-9"
            data-aos="fade-in"
            data-aos-delay="400"
          >
            <div className="mt-4 text-center">
              <Link
                href="/auth/forgetpass/phone"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <hr />

            <div className="mt-2 text-center text-sm">
              <span>Don’t have an account? </span>
              <Link
                href="/auth/signup"
                className="text-blue-600 font-bold hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs font-medium mb-5 text-gray-400 py text-center">
        <span className="bg-white/50 px-2 py-1 rounded-md backdrop-blur-xl">
          © {new Date().getFullYear()} InsureCow. All rights reserved.
        </span>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default Login;
