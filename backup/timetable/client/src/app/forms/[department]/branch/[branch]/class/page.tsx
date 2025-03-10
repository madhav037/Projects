"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";

export default function ClassForm() {
  const [classInfo, setClassInfo] = useState({
    classNumber: "",
    totalBatches: "",
    totalStudentsPerBatch: "",
  });
  const [classList, setClassList] = useState<
    { classNumber: string; totalBatches: string; totalStudentsPerBatch: string }[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClassInfo((prev) => ({ ...prev, [name]: value }));
  };

  const addClass = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      classInfo.classNumber &&
      classInfo.totalBatches &&
      classInfo.totalStudentsPerBatch
    ) {
      if (editingIndex !== null) {
        // Update existing class
        const updatedClasses = [...classList];
        updatedClasses[editingIndex] = classInfo;
        setClassList(updatedClasses);
        setEditingIndex(null);
      } else {
        // Add new class
        setClassList((prev) => [...prev, classInfo]);
      }
      setClassInfo({ classNumber: "", totalBatches: "", totalStudentsPerBatch: "" });
    } else {
      alert("Please fill in all fields");
    }
  };

  const deleteClass = (index: number) => {
    setClassList((prev) => prev.filter((_, i) => i !== index));
  };

  const editClass = (index: number) => {
    const selectedClass = classList[index];
    setClassInfo(selectedClass);
    setEditingIndex(index);
  };

  const saveAllClasses = () => {
    console.log("Saving all classes to the database:", classList);
    alert("All classes saved to the database!");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-5">
      <div className="w-[90vw] max-w-3xl bg-white shadow-lg rounded-2xl px-10 py-6 space-y-6">
        <div className="text-center font-bold text-2xl text-gray-900 mt-8">
          {editingIndex !== null ? "Edit Class" : "Add New Class"}
        </div>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-4">
            <input
              type="text"
              name="classNumber"
              value={classInfo.classNumber}
              onChange={handleInputChange}
              placeholder="Class Number"
              className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500 w-1/2"
            />
            <input
              type="text"
              name="totalBatches"
              value={classInfo.totalBatches}
              onChange={handleInputChange}
              placeholder="Total Batches"
              className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500 w-1/2"
            />
          </div>
          <input
            type="number"
            name="totalStudentsPerBatch"
            value={classInfo.totalStudentsPerBatch}
            onChange={handleInputChange}
            placeholder="Total Students per Batch"
            className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500"
          />

          {classList.length > 0 && (
            <div className="text-center font-bold text-4xl text-gray-900 mb-4">Class List</div>
          )}
          <div className="flex flex-wrap justify-start">
            {classList.map((cls, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md flex shadow-sm text-gray-700 m-1">
                <div>
                  <p className="text-xs text-gray-400">Class No: {cls.classNumber}</p>
                  <p className="text-xs text-gray-400">Total Batches: {cls.totalBatches}</p>
                  <p className="text-xs text-gray-400">Students per Batch: {cls.totalStudentsPerBatch}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="ml-4 text-gray-600 hover:text-yellow-500" onClick={() => editClass(index)}>
                    <LuPencil size={16} />
                  </button>
                  <button className="ml-2 text-gray-600 hover:text-red-500" onClick={() => deleteClass(index)}>
                    <IoClose size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={addClass}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-bold mt-4"
              type="button"
            >
              {editingIndex !== null ? "Save Changes" : "Add Class"}
            </button>
            <button
              onClick={saveAllClasses}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md font-bold mt-4"
              type="button"
            >
              Save All Classes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
