"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";

export default function SemesterForm() {
  const [semesterInfo, setSemesterInfo] = useState({
    semesterNumber: "",
    facultySubjects: [{ faculty: "", subject: "" }],
  });

  const [semesterList, setSemesterList] = useState<
    { semesterNumber: string; facultySubjects: { faculty: string; subject: string }[] }[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const facultyOptions = ["Dr. Smith", "Prof. John", "Dr. Clark"];
  const subjectOptions = ["Mathematics", "Physics", "Computer Science"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSemesterInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacultySubjectChange = (
    index: number,
    field: "faculty" | "subject",
    value: string
  ) => {
    const updatedFacultySubjects = [...semesterInfo.facultySubjects];
    updatedFacultySubjects[index][field] = value;
    setSemesterInfo((prev) => ({ ...prev, facultySubjects: updatedFacultySubjects }));
  };

  const addFacultySubject = () => {
    setSemesterInfo((prev) => ({
      ...prev,
      facultySubjects: [...prev.facultySubjects, { faculty: "", subject: "" }],
    }));
  };

  const removeFacultySubject = (index: number) => {
    setSemesterInfo((prev) => ({
      ...prev,
      facultySubjects: prev.facultySubjects.filter((_, i) => i !== index),
    }));
  };

  const addSemester = (e: React.MouseEvent) => {
    e.preventDefault();
    if (semesterInfo.semesterNumber && semesterInfo.facultySubjects.length > 0) {
      if (editingIndex !== null) {
        const updatedSemesters = [...semesterList];
        updatedSemesters[editingIndex] = semesterInfo;
        setSemesterList(updatedSemesters);
        setEditingIndex(null);
      } else {
        setSemesterList((prev) => [...prev, semesterInfo]);
      }
      setSemesterInfo({ semesterNumber: "", facultySubjects: [{ faculty: "", subject: "" }] });
    } else {
      alert("Please fill in all fields");
    }
  };

  const deleteSemester = (index: number) => {
    setSemesterList((prev) => prev.filter((_, i) => i !== index));
  };

  const editSemester = (index: number) => {
    const selectedSemester = semesterList[index];
    setSemesterInfo(selectedSemester);
    setEditingIndex(index);
  };

  const saveAllSemesters = () => {
    console.log("Saving all semesters to the database:", semesterList);
    alert("All semesters saved to the database!");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-5">
      <div className="w-[90vw] max-w-3xl bg-white shadow-lg rounded-2xl px-10 py-6 space-y-6">
        <div className="text-center font-bold text-2xl text-gray-900 mt-8">
          {editingIndex !== null ? "Edit Semester" : "Add New Semester"}
        </div>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="semesterNumber"
            value={semesterInfo.semesterNumber}
            onChange={handleInputChange}
            placeholder="Semester Number"
            className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500"
          />

          <div className="space-y-4">
            {semesterInfo.facultySubjects.map((fs, index) => (
              <div key={index} className="flex gap-4 items-center">
                <select
                  name="faculty"
                  value={fs.faculty}
                  onChange={(e) => handleFacultySubjectChange(index, "faculty", e.target.value)}
                  className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Faculty</option>
                  {facultyOptions.map((faculty, i) => (
                    <option key={i} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
                <select
                  name="subject"
                  value={fs.subject}
                  onChange={(e) => handleFacultySubjectChange(index, "subject", e.target.value)}
                  className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Subject</option>
                  {subjectOptions.map((subject, i) => (
                    <option key={i} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="text-gray-600 hover:text-red-500"
                  onClick={() => removeFacultySubject(index)}
                >
                  <IoClose size={20} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addFacultySubject}
            className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-md font-bold"
          >
            Add Faculty & Subject
          </button>

          {semesterList.length > 0 && (
            <div className="text-center font-bold text-4xl text-gray-900 mb-4">Semester List</div>
          )}
          <div className="flex flex-wrap justify-start">
            {semesterList.map((semester, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md flex shadow-sm text-gray-700 m-1">
                <div>
                  <p className="font-bold">Semester: {semester.semesterNumber}</p>
                  {semester.facultySubjects.map((fs, i) => (
                    <p key={i} className="text-xs text-gray-400">
                      Faculty: {fs.faculty}, Subject: {fs.subject}
                    </p>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button className="ml-4 text-gray-600 hover:text-yellow-500" onClick={() => editSemester(index)}>
                    <LuPencil size={16} />
                  </button>
                  <button className="ml-2 text-gray-600 hover:text-red-500" onClick={() => deleteSemester(index)}>
                    <IoClose size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={addSemester}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-bold mt-4"
              type="button"
            >
              {editingIndex !== null ? "Save Changes" : "Add Semester"}
            </button>
            <button
              onClick={saveAllSemesters}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md font-bold mt-4"
              type="button"
            >
              Save All Semesters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
