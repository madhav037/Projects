"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const page = () => {
  const [uni_id, setUni_id] = useState("");
  const params = useParams();
  const [sessions, setSessions] = useState([
    {
      id: 0,
      session_sequence: 0,
      do_nothing: false,
      duration: 0,
      dept_id: 0,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    session_sequence: 0,
    do_nothing: false,
    duration: 0,
  });
  const [session_id, setSession_Id] = useState(0);
  const router = useRouter();
  const department_id = params.department;

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

    await get_sessions(customData);
  };

  const handle_delete = async (session_id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/department/${department_id}/session/${session_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.status === 201) {
      console.log("Data successfully deleted:", data);
      setSessions(sessions.filter((data) => data.id !== session_id));
      router.refresh();
    } else {
      console.error("Error deleting data:", data);
    }
  };

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (
    session_sequence: any,
    duration: any,
    do_nothing: any
  ) => {
    setIsModalOpen(true);
    setInputData({
      session_sequence: session_sequence,
      duration: duration,
      do_nothing: do_nothing,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const url =
        session_id === 0
          ? `http://localhost:3000/api/university/${uni_id}/department/${department_id}/session`
          : `http://localhost:3000/api/university/${uni_id}/department/${department_id}/session/${session_id}`;

      const method = session_id === 0 ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_sequence: inputData.session_sequence,
          do_nothing: inputData.do_nothing,
          duration: inputData.duration,
        }),
      });
      const result = await response.json();
      console.log("Data successfully posted:", result);

      if (result.function_name === "update_session") {
        setSessions((preSes) =>
          preSes.map((ses) =>
            ses.id === session_id
              ? {
                  ...ses,
                  session_sequence: inputData.session_sequence,
                  do_nothing: inputData.do_nothing,
                  duration: inputData.duration,
                }
              : ses
          )
        );
      }

      if (result.function_name === "create_session") {
        setSessions((preSes) => [...preSes, result.data[0]]);
      }

      setIsModalOpen(false);
      setInputData({
        session_sequence: 0,
        do_nothing: false,
        duration: 0,
      });
      setSession_Id(0);
      router.refresh();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const get_sessions = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/department/${department_id}/session`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      setSessions(data.data);
    } else {
      setSessions([]);
    }
  };

  const get_session_data = sessions.map((data, index) => {
    return (
      <div
        className="main_content group shadow-md relative justify-center items-center w-full font-bold rounded-sm"
        key={index}
      >
        <div className="edit_delete opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-md group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-all duration-1000  flex  border-black justify-center items-center h-full p-2 w-full absolute">
          <button
            onClick={(e) => {
              handle_edit(
                data.session_sequence,
                data.duration,
                data.do_nothing
              );
              setSession_Id(data.id);
            }}
            className="flex gap-1 hover:text-green-600 border-r border-black p-2"
          >
            <FiEdit size={20} />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              handle_delete(data.id);
            }}
            className="flex gap-1 hover:text-red-600 p-2"
          >
            <FiTrash2 size={20} />
            <span>Delete</span>
          </button>
        </div>
        <div className="right_content w-full flex flex-col gap-0 p-5 ">
          <p className=" text-2xl text-slate-950">{data.session_sequence}</p>
          <p className=" text-2xl text-slate-950">
            {data.do_nothing ? "Break" : "Allocated"}
          </p>
          <p className=" text-2xl text-slate-950">Duration : {data.duration}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
      <div className="flex justify-between w-full">
        <div className="text-3xl font-bold text-slate-950">Session</div>
        <button
          onClick={handle_insert}
          className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
        >
          <FaPlus></FaPlus> <div>New</div>
        </button>

        {isModalOpen && (
          <div className="fixed z-10 top-0 left-0 right-0 bottom-0 text-slate-950 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <div className="flex relative">
                <div className="flex-1 ">
                  <h1 className="text-lg font-bold mb-4">Add New Session</h1>
                </div>
                <div className="absolute right-0">
                  <button
                    className="hover:text-red-500"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <IoClose size={24} />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  id="data"
                  type="number"
                  value={
                    inputData.session_sequence ? inputData.session_sequence : ""
                  }
                  placeholder="Enter Session Sequence"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      session_sequence: Number(e.target.value),
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  id="data"
                  type="number"
                  value={inputData.duration ? inputData.duration : ""}
                  placeholder="Enter Session Duration"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      duration: Number(e.target.value),
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                <div className="mt-1 p-2 flex gap-3 text-gray-500 items-center w-full">
                  <label>Is Break Session ?</label>
                  <input
                    id="data"
                    type="checkbox"
                    checked={
                      inputData.do_nothing ? inputData.do_nothing : false
                    }
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        do_nothing: e.target.checked,
                      })
                    }
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 w-full gap-5">
        {sessions.length > 0 ? get_session_data : null}
      </div>
    </div>
  );
};

export default page;
