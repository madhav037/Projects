"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IconUserCircle } from "@tabler/icons-react";
import { LuLogOut } from "react-icons/lu";

import Link from "next/link";
const Header = () => {
  const profileRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !(profileRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  const handleLogout = async () => {
    const response = await fetch("/api/admin/logout", {
      method: "GET",
    });
    const data = await response.json();
    if (data.function_name === "logout-success") {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex justify-between bg-[#DBD3D3] text-[#070F2B] shadow-lg items-center px-3 py-1">
      {/* <div className="text-3xl font-bold">EduScheduler</div> */}
      <Image
        src="/logo.png"
        alt="EduScheduler"
        width={100}
        height={100}
        className="w-32 ms-5"
      />

      <div className="flex gap-10 mx-2">
        <div ref={profileRef}>
          {/* <Image src="/globe.svg" alt="Logout" width={30} height={30} /> */}
          <IconUserCircle
            size={35}
            className="text-[#070F2B] cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          ></IconUserCircle>
          {showDropdown && (
            <div className="absolute z-10 right-8 top-14 border border-black bg-[#DBD3D3] shadow-lg rounded-md">
              <div className="py-1">
                <Link
                  href="/logout"
                  className=" px-4 py-2 text-[#070F2B]  flex justify-center items-center p-2"
                  onClick={handleLogout}
                >
                  <LuLogOut className="mx-2" />
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
