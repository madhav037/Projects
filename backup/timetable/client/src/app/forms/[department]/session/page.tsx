"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";

export default function SessionForm() {
  const [session, setSession] = useState({
    sequence: "",
    duration: "",
    allotLectures: false,
  });
  const [sessionList, setSessionList] = useState<
    { sequence: string; duration: string; allotLectures: boolean }[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSession((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addSession = (e: React.MouseEvent) => {
    e.preventDefault();
    if (session.sequence && session.duration) {
      if (editingIndex !== null) {
        // Update session
        const updatedSessions = [...sessionList];
        updatedSessions[editingIndex] = session;
        setSessionList(updatedSessions);
        setEditingIndex(null); // Reset edit mode
      } else {
        // Add new session
        setSessionList((prev) => [...prev, session]);
      }
      setSession({ sequence: "", duration: "", allotLectures: false });
    } else {
      alert("Please fill in all fields");
    }
  };

  const deleteSession = (index: number) => {
    setSessionList((prev) => prev.filter((_, i) => i !== index));
  };

  const editSession = (index: number) => {
    const selectedSession = sessionList[index];
    setSession(selectedSession);
    setEditingIndex(index);
  };

  const saveAllSessions = () => {
    // Simulate saving to the database
    console.log("Saving all sessions to the database:", sessionList);
    alert("All sessions saved to the database!");
  };

  return (
    <div className=" h-screen flex flex-col items-center justify-center p-5">
      <div className="w-[90vw] max-w-3xl bg-white shadow-lg rounded-2xl px-10 py-6 space-y-6">
        {/* Session form */}
        <div className="text-center font-bold text-2xl text-gray-900 mt-8">
          {editingIndex !== null ? "Edit Session" : "Add New Session"}
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="number"
            name="sequence"
            value={session.sequence}
            onChange={handleInputChange}
            placeholder="Session Sequence"
            className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            name="duration"
            value={session.duration}
            onChange={handleInputChange}
            placeholder="Duration"
            className="border border-gray-300 p-3 text-black rounded-md focus:outline-none focus:border-blue-500"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="allotLectures"
              checked={session.allotLectures}
              onChange={handleInputChange}
              className="h-5 w-5 border-gray-300 rounded-md focus:outline-none"
            />
            <label className="text-gray-700">Allot Lectures</label>
          </div>

          {sessionList.length > 0 && (
            <div className="text-center font-bold text-4xl text-gray-900 mb-4">
              Session List
            </div>
          )}
          {/* Display list of sessions */}
          <div className="flex flex-wrap justify-start">
            {sessionList.map((sess, index) => (
              <div
                key={index}
                className=" p-4 border border-gray-200 rounded-md flex items-center shadow-sm text-gray-700 m-1"
              >
                <div>
                  <p className="font-bold">Sequence: {sess.sequence}</p>
                  <p>Duration: {sess.duration}</p>
                  <p>Allot Lectures: {sess.allotLectures ? "Yes" : "No"}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="ml-2 text-gray-600 hover:text-yellow-500"
                    onClick={() => editSession(index)}
                  >
                    <LuPencil size={20} />
                  </button>
                  <button
                    className="ml-2 text-gray-600 hover:text-red-500"
                    onClick={() => deleteSession(index)}
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={addSession}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-bold mt-4"
              type="button"
            >
              {editingIndex !== null ? "Save Changes" : "Add Session"}
            </button>
            <button
              onClick={saveAllSessions}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md font-bold mt-4"
              type="button"
            >
              Save All Sessions
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
