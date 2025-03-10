"use client";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
const CustomDropdown = ({ label, options, disabled, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleReset = () => {
    onChange(""); // Reset the selected value
    setIsOpen(false);
  };

  // Close the dropdown if a click is detected outside of it
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-tooltip-target="tooltip-bottom"
          data-tooltip-placement="bottom"
          className={
            `w-full bg-white border border-gray-300 rounded-lg py-2 px-4 text-left focus:outline-none` +
            (disabled ? " cursor-not-allowed" : " cursor-pointer")
          }
          disabled={disabled}
        >
          <div className="flex justify-between">
            {value || `Select ${label.toLowerCase()}`}
            {value && (
              <span
                onClick={handleReset}
                className="  text-gray-500 focus:outline-none hover:text-red-600"
              >
                <IoClose size={24} />
              </span>
            )}
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {options.length === 0 ? (
            <div className="px-4 py-2 cursor-not-allowed">No options found</div>
          ) : (
            options.map((option) => (
              <div
                key={option}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {option}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
