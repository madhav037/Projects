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
  const [class_id, setClass_id] = useState(0);
  const [classData, setClassData] = useState([
    {
      id: 0,
      class_no: 0,
      total_batches: 0,
      students_per_batch: 0,
      branch_id: 0,
    },
  ]);
  const router = useRouter();
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    class_no: 0,
    total_batches: 0,
    students_per_batch: 0,
  });

  const dept_id = params.department;
  const branch_id = params.branch;

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
      .catch((error) => console.log("Error fetching data", error));

    await getClassData(customData);
  };

  const getClassData = async (uni_id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      setClassData(data.data);
    } else {
      setClassData([]);
    }
  };

  const handle_delete = async (class_id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}`,
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
      setClassData(classData.filter((data) => data.id !== class_id));
      router.refresh();
    } else {
      console.error("Error deleting data:", data);
    }
  };

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (
    class_no: number,
    total_batches: number,
    students_per_batch: number
  ) => {
    setIsModalOpen(true);
    setInputData({ class_no, total_batches, students_per_batch });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const url =
        class_id === 0
          ? `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class`
          : `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}`;

      const method = class_id === 0 ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_no: inputData.class_no,
          total_batches: inputData.total_batches,
          students_per_batch: inputData.students_per_batch,
        }),
      });
      const result = await response.json();
      console.log("Data successfully posted:", result);

      if (result.function_name === "update_class") {
        setClassData((prevClass) =>
          prevClass.map((cls) =>
            cls.id === class_id
              ? {
                  ...cls,
                  class_no: inputData.class_no,
                  total_batches: inputData.total_batches,
                  students_per_batch: inputData.students_per_batch,
                }
              : cls
          )
        );
      }

      if (result.function_name === "create_class") {
        setClassData((prevClass) => [...prevClass, result.data[0]]);
      }

      setIsModalOpen(false);
      setInputData({
        class_no: 0,
        total_batches: 0,
        students_per_batch: 0,
      });
      setClass_id(0);
      router.refresh();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  console.log(classData);

  const get_class_data = classData.map((data, index) => {
    return (
      <div
        className="main_content group shadow-md relative justify-center items-center w-full font-bold rounded-sm"
        key={index}
        onClick={() => {
          router.push(
            `/dashboard/department/${dept_id}/branch/${branch_id}/${data.id}`
          );
        }}
      >
        <div className="edit_delete opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-md group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-all duration-1000  flex  border-black justify-center items-center h-full p-2 w-full absolute">
          <button
            onClick={(e) => {
              handle_edit(
                data.class_no,
                data.total_batches,
                data.students_per_batch
              );
              setClass_id(data.id);
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
          <p className=" text-2xl text-slate-950">Class No : {data.class_no}</p>
          <p className=" text-2xl text-slate-950">
            Total Batch : {data.total_batches}
          </p>
          <p className=" text-2xl text-slate-950">
            Student Per Batch : {data.students_per_batch}
          </p>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
      <div className="flex justify-between w-full">
        <div className="text-3xl font-bold text-slate-950">Class</div>
        <button
          onClick={handle_insert}
          className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
        >
          <FaPlus></FaPlus> <div>New</div>
        </button>

        {isModalOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <div className="flex relative">
                <div className="flex-1 ">
                  <h1 className="text-lg font-bold mb-4">Add New class</h1>
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
                <label htmlFor="" className="text-sm font-semibold">
                  Enter Starting Class Year
                </label>
                <input
                  id="data"
                  type="number"
                  value={inputData.class_no > 0 ? inputData.class_no : ""}
                  placeholder="Enter Starting Class Year"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      class_no: Number(e.target.value),
                    })
                  }
                  className="mb-3 p-2 border border-gray-300 rounded-md w-full"
                />
                <label htmlFor="" className="text-sm font-semibold">
                  Enter Total Batches
                </label>
                <input
                  id="data"
                  type="number"
                  value={
                    inputData.total_batches > 0 ? inputData.total_batches : ""
                  }
                  placeholder="Enter Total Batches"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      total_batches: Number(e.target.value),
                    })
                  }
                  className="mb-3 p-2 border border-gray-300 rounded-md w-full"
                />
                <label htmlFor="" className="text-sm font-semibold">
                  Enter Students Per Batch
                </label>
                <input
                  id="data"
                  type="number"
                  value={
                    inputData.students_per_batch > 0
                      ? inputData.students_per_batch
                      : ""
                  }
                  placeholder="Enter Students Per Batch"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      students_per_batch: Number(e.target.value),
                    })
                  }
                  className=" p-2 border border-gray-300 rounded-md w-full"
                />

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
      <div className="grid grid-cols-3 w-full gap-5">
        {classData.length > 1 ? get_class_data : null}
      </div>
    </div>
  );
};

export default page;
