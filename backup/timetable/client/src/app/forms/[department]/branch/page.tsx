"use client"
import React, { useState, useEffect } from "react";

interface BranchFormProps {
  departmentList: { id: string; name: string }[]; // Department data fetched from DB
}

export default function BranchForm({ departmentList }: BranchFormProps) {
  const [branch, setBranch] = useState({ branchName: "" });
  const [branchList, setBranchList] = useState<{ [key: string]: string[] }>({});
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [branchListForDepartment, setBranchListForDepartment] = useState<
    string[]
  >([]);
  const [editingBranchIndex, setEditingBranchIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    // Reset branches when a department is selected
    setBranchListForDepartment(branchList[selectedDepartment] || []);
  }, [selectedDepartment, branchList]);

  // Handle branch input changes
  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBranch((prev) => ({ ...prev, [name]: value }));
  };

  // Handle department selection changes
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDept = e.target.value;
    setSelectedDepartment(selectedDept);
  };

  // Add or update branch in the branch list
  const addBranch = () => {
    if (branch.branchName && selectedDepartment) {
      const updatedBranchList = { ...branchList };
      const departmentBranches = updatedBranchList[selectedDepartment] || [];

      if (editingBranchIndex !== null) {
        departmentBranches[editingBranchIndex] = branch.branchName;
      } else {
        departmentBranches.push(branch.branchName);
      }

      updatedBranchList[selectedDepartment] = departmentBranches;
      setBranchList(updatedBranchList);
      setBranchListForDepartment(departmentBranches);
      setBranch({ branchName: "" });
      setEditingBranchIndex(null);
    } else {
      alert("Please select a department and enter a branch name");
    }
  };

  // Edit an existing branch
  const editBranch = (index: number) => {
    const selectedBranch = branchListForDepartment[index];
    setBranch({ branchName: selectedBranch });
    setEditingBranchIndex(index);
  };

  // Delete an existing branch
  const deleteBranch = (index: number) => {
    const updatedBranchList = [...branchListForDepartment];
    updatedBranchList.splice(index, 1);
    setBranchListForDepartment(updatedBranchList);

    const updatedGlobalBranchList = { ...branchList };
    updatedGlobalBranchList[selectedDepartment] = updatedBranchList;
    setBranchList(updatedGlobalBranchList);
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div className="w-[90vw] max-w-3xl bg-white shadow-lg rounded-2xl px-10 py-6 space-y-6">
        <div className="text-center font-bold text-2xl text-gray-900 mt-8">
          {editingBranchIndex !== null ? "Edit Branch" : "Add New Branch"}
        </div>

        {/* Department Dropdown */}
        <select
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500 w-full"
        >
          <option value="">Select Department</option>
          {/* {departmentList.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))} */}
        </select>

        {/* Branch Input */}
        <input
          type="text"
          name="branchName"
          value={branch.branchName}
          onChange={handleBranchChange}
          placeholder="Branch Name"
          className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500 w-full"
        />

        {/* Branch List for the Selected Department */}
        {branchListForDepartment.length > 0 && (
          <div className="text-center font-bold text-4xl text-gray-900 mb-4">
            Branch List for {departmentList.find((d) => d.id === selectedDepartment)?.name}
          </div>
        )}
        <div className="flex flex-wrap justify-start">
          {branchListForDepartment.map((branchName, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-md flex shadow-sm text-gray-700 m-1"
            >
              <div>
                <p className="font-bold">{branchName}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="ml-4 text-gray-600 hover:text-yellow-500"
                  onClick={() => editBranch(index)}
                >
                  Edit
                </button>
                <button
                  className="ml-2 text-gray-600 hover:text-red-500"
                  onClick={() => deleteBranch(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={addBranch}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-bold mt-4"
            type="button"
          >
            {editingBranchIndex !== null ? "Save Changes" : "Add Branch"}
          </button>
        </div>
      </div>
    </div>
  );
}
