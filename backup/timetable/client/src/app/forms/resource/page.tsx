"use client";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { toast } from "react-toastify";
export default function Resource() {
  const [resource, setResource] = useState({
    resource_name: "",
    type: "",
    duration: "",
    capacity: "",
  });
  const [uni_id, setUni_id] = useState("");

  const [dropdowntypes, setDropdowntypes] = useState<string[]>([]); // Dropdown items for user-added types
  const [showDropdown, setShowDropdown] = useState(false);
  const [resourceList, setResourceList] = useState<
    {
      resource_name: string;
      type: string;
      duration: string;
      capacity: string;
    }[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newType, setNewType] = useState(""); // To capture the custom type to be added
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown area

  useEffect(() => {
    get_uni_id();
  }, []);

  const get_uni_id = async () => {
    let customData;
    await fetch(window.location.href)
      .then((res) => {
        customData = res.headers.get("uni_id");
        if (customData) {
          setUni_id(customData);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResource((prev) => ({ ...prev, [name]: value }));
  };

  const addResource = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      resource.resource_name &&
      resource.type &&
      resource.duration &&
      resource.capacity
    ) {
      if (editingIndex !== null) {
        // Update existing resource
        const updatedResources = [...resourceList];
        updatedResources[editingIndex] = resource;
        setResourceList(updatedResources);
        setEditingIndex(null);
      } else {
        // Add new resource
        setResourceList((prev) => [...prev, resource]);
      }
      setResource({ resource_name: "", type: "", duration: "", capacity: "" });
    } else {
      alert("Please fill in all fields");
    }
  };

  const deleteResource = (index: number) => {
    setResourceList((prev) => prev.filter((_, i) => i !== index));
  };

  const editResource = (index: number) => {
    const selectedResource = resourceList[index];
    setResource(selectedResource);
    setEditingIndex(index);
  };

  const saveAllResources = async () => {
    for (const res of resourceList) {
      console.log(res);

      const response = await fetch(
        `http://localhost:3000/api/university/${uni_id}/resource`,
        {
          method: "POST",
          body: JSON.stringify(res),
        }
      );
      const data = await response.json();
      if (data.status === 201) {
        continue;
      } else {
        console.error(data.error_message);
        return;
      }
    }

    toast.success("All resources saved successfully");
    setResourceList([]);
    router.push("/dashboard");
  };

  const handleAddType = () => {
    if (newType && !dropdowntypes.includes(newType)) {
      setDropdowntypes((prev) => [...prev, newType]); // Add the new type to the list
      setNewType(""); // Clear the input field
    }
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="h-screen flex flex-col items-center justify-center p-5">
      <div className="w-[90vw] max-w-3xl bg-white shadow-lg rounded-2xl px-10 py-6 space-y-6">
        <div className="text-center font-bold text-2xl text-gray-900 mt-8">
          {editingIndex !== null ? "Edit Resource" : "Add New Resource"}
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            name="resource_name"
            value={resource.resource_name}
            onChange={handleInputChange}
            placeholder="Name"
            className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500"
          />
          {/* Inline input fields for Type, Duration, and Capacity */}
          <div className="flex gap-4 ">
            <div ref={dropdownRef} className="relative w-1/3 ">
              <input
                type="text"
                name="type"
                list="types"
                value={resource.type}
                onChange={handleInputChange}
                placeholder="Type"
                className="border border-gray-300 p-3 text-black rounded-md focus:outline-none focus:border-blue-500 w-full"
                autoComplete="off"
                onFocus={() => setShowDropdown(true)}
              />
              {showDropdown && (
                <div className="absolute top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                  <div className="flex items-center p-2  text-white rounded-md">
                    <input
                      type="text"
                      placeholder="Add new type"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full p-1 rounded-md text-black border border-gray-300 focus:outline-none focus:border-blue-500 "
                    />
                    <button
                      type="button"
                      onClick={handleAddType}
                      className="ml-2 p-1 font-bold cursor-pointer text-blue-500 hover:border-blue-500 hover:border rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  {dropdowntypes.map((type, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                      onClick={() => {
                        setResource((prev) => ({ ...prev, type }));
                        setShowDropdown(false);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              name="duration"
              value={resource.duration}
              onChange={handleInputChange}
              placeholder="Duration"
              className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500 w-1/3"
            />
            <input
              type="number"
              name="capacity"
              value={resource.capacity}
              onChange={handleInputChange}
              placeholder="Capacity"
              className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500 w-1/3"
            />
          </div>

          {resourceList.length > 0 && (
            <div className="text-center font-bold text-4xl text-gray-900 mb-4">
              Resource List
            </div>
          )}
          <div className="flex flex-wrap justify-start">
            {resourceList.map((res, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-md flex shadow-sm text-gray-700 m-1"
              >
                <div>
                  <p className="font-bold">{res.resource_name}</p>
                  <p className="text-xs text-gray-400">{res.type}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="ml-4 text-gray-600 hover:text-yellow-500"
                    onClick={() => editResource(index)}
                  >
                    <LuPencil size={16} />
                  </button>
                  <button
                    className="ml-2 text-gray-600 hover:text-red-500"
                    onClick={() => deleteResource(index)}
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={addResource}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-bold mt-4"
              type="button"
            >
              {editingIndex !== null ? "Save Changes" : "Add Resource"}
            </button>
            <button
              onClick={saveAllResources}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md font-bold mt-4"
              type="button"
            >
              Save All Resources
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
