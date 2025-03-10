"use client";
import Loading from "@/app/dashboard/loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    university: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    university: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", email: "", password: "", university: "" };

    // Username Validation
    if (!user.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    // University Validation
    if (!user.university.trim()) {
      newErrors.university = "University name is required";
      isValid = false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(user.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password Validation
    if (!user.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    // Reset errors for the field on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const signUp = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent page refresh
    setLoading(true);
    if (validateForm()) {
      await fetch("http://localhost:3000/api/admin/signup", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          if (data.status === 200) {
            toast.success(data.message);
            router.push("/forms/signin");
          } else {
            toast.error(data.message);
          }
        })
        .catch(() => {
          toast.error("An error occurred. Please try again.");
        });
    } else {
      toast.warn("Please correct the highlighted fields");
    }
  };

  return (
    <div className="bg-gray-900 h-screen flex justify-center items-center">
      {loading && <Loading />}
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="flex w-[90vw] max-w-4xl bg-white shadow-lg justify-around items-center rounded-2xl p-10 space-x-6">
        <div className="flex-[0.4] flex justify-center flex-col items-center">
          <div className="mb-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900">Sign Up</h1>
            <p className="text-gray-600 mt-2">Create a new account</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-6 w-full">
            Sign up with Google
          </button>
          <div className="text-gray-600 mt-4">
            Already have an account?&nbsp;
            <Link
              href="/forms/signin"
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="flex-[0.6] flex justify-center flex-col items-center">
          <input
            type="text"
            className={`border border-gray-300 p-3 text-black text-lg my-3 w-[80%] rounded-md focus:outline-none ${
              errors.username && "border-red-500"
            }`}
            placeholder="Username"
            name="username"
            onChange={handleInputChange}
          />
          {errors.username && (
            <p className="text-red-500 text-sm w-[80%]">{errors.username}</p>
          )}
          <input
            type="text"
            className={`border border-gray-300 p-3 text-black text-lg my-3 w-[80%] rounded-md focus:outline-none ${
              errors.university && "border-red-500"
            }`}
            placeholder="University Name"
            name="university"
            onChange={handleInputChange}
          />
          {errors.university && (
            <p className="text-red-500 text-sm w-[80%]">{errors.university}</p>
          )}
          <input
            type="email"
            className={`border border-gray-300 text-black p-3 text-lg my-3 w-[80%] rounded-md focus:outline-none ${
              errors.email && "border-red-500"
            }`}
            placeholder="Email"
            name="email"
            onChange={handleInputChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm w-[80%]">{errors.email}</p>
          )}
          <input
            type="password"
            className={`border border-gray-300 p-3 text-black text-lg my-3 w-[80%] rounded-md focus:outline-none ${
              errors.password && "border-red-500"
            }`}
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm w-[80%]">{errors.password}</p>
          )}

          <button
            className="bg-gray-700 hover:bg-gray-800 text-white py-3 w-[80%] rounded-md mt-4"
            onClick={signUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
