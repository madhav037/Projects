"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const page = () => {
  const [uni_id, setUni_id] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [all_classes, setAllClasses] = useState([
    {
      id: 0,
      class_no: 0,
      total_batches: 0,
      students_per_batch: 0,
      branch_id: 0,
      branch_name: "",
      dept_name: "",
      dept_id: 0,
    },
  ]);
  const [one_class, setOneClass] = useState<{
    id: number | null;
    class_no: number | null;
    total_batches: number | null;
    students_per_batch: number | null;
    branch_id: number | null;
  }>({
    id: null,
    class_no: null,
    total_batches: null,
    students_per_batch: null,
    branch_id: null,
  });

  const [all_department, setAllDepartment] = useState([
    { id: 0, department_name: "", uni_id: 0 },
  ]);
  const [filteredDepartment, setFilteredDepartment] = useState([
    { id: 0, department_name: "", uni_id: 0 },
  ]);
  const [selected_department, setSelectedDepartment] = useState({
    id: 0,
    department_name: "",
    uni_id: 0,
  });
  const [all_branches, setAllBranches] = useState([
    {
      id: 0,
      branch_name: "",
      dept_id: 0,
      dept_name: "",
    },
  ]);
  const [filteredBranches, setFilteredBranches] = useState([
    {
      id: 0,
      branch_name: "",
      dept_id: 0,
      dept_name: "",
    },
  ]);
  const [selected_branch, setSelectedBranch] = useState({
    id: 0,
    branch_name: "",
    dept_id: 0,
    dept_name: "",
  });
  const [branches, setBranches] = useState([
    { id: 0, branch_name: "", dept_id: 0, dept_name: "" },
  ]);
  const [previous_data, setPreviousData] = useState({
    id: 0,
    class_no: 0,
    total_batches: 0,
    students_per_batch: 0,
    branch_id: 0,
    branch_name: "",
    dept_name: "",
    dept_id: 0,
  });
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const router = useRouter();
  const dropdownRef1 = useRef<HTMLDivElement>(null);
  const dropdownRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    get_uni_id();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target as Node)
      ) {
        setShowDropdown1(false);
      }
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target as Node)
      ) {
        setShowDropdown2(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef1, dropdownRef2]);

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

    await getDepartment(customData);
    await getBranch(customData);
    await getClasses(customData);
  };

  const getDepartment = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/department`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setAllDepartment(data.data);
      setFilteredDepartment(data.data);
    } else {
      console.log("No data");
    }
  };

  const getBranch = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/branch`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setAllBranches(data.data);
      setFilteredBranches(data.data);
    } else {
      console.log("No data");
    }
  };

  const getClasses = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/class`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setAllClasses(data.data);
    } else {
      console.log("No data");
    }
  };

  const handle_insert = () => {
    setSelectedDepartment({
      id: 0,
      department_name: "",
      uni_id: 0,
    });
    setSelectedBranch({
      id: 0,
      branch_name: "",
      dept_id: 0,
      dept_name: "",
    });
    setOneClass({
      id: 0,
      class_no: null,
      total_batches: null,
      students_per_batch: null,
      branch_id: 0,
    });
    setIsModalOpen(true);
  };

  const handle_edit = (br: any) => {
    console.log(br);
    setIsModalOpen(true);
    setOneClass({
      id: br.id,
      class_no: br.class_no,
      total_batches: br.total_batches,
      students_per_batch: br.students_per_batch,
      branch_id: br.branch_id,
    });
    setFilteredBranches(all_branches.filter((data) => data.dept_id === br.dept_id));
  };

  const handle_delete = async (br: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/department/${br.dept_id}/branch/${br.id}/class/${br.id}`,
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
      setAllClasses(all_classes.filter((data) => data.id !== br.id));
      setOneClass({
        id: 0,
        class_no: null,
        total_batches: null,
        students_per_batch: null,
        branch_id: 0,
      });
      router.refresh();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log(one_class);

      const url =
        one_class.id === 0 || one_class.id === null
          ? `http://localhost:3000/api/university/${uni_id}/department/${selected_department.id}/branch/${selected_branch.id}/class`
          : `http://localhost:3000/api/university/${uni_id}/department/${previous_data.dept_id}/branch/${previous_data.branch_id}/class/${one_class.id}`;

      const method =
        one_class.id === 0 || one_class.id === null ? "POST" : "PUT";

      if (method === "PUT") {
        setOneClass({ ...one_class, branch_id: selected_branch.id });
      }

      console.log(one_class);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(one_class),
      });

      const result = await response.json();

      if (result.status === 201) {
        console.log("class successfully posted:", result);
        console.log(result.data);

        if (result.function_name === "update_class") {
          setAllClasses((prev: any) =>
            prev.map((cl: any) =>
              cl.id === one_class.id
                ? {
                  ...cl,
                  class_no: one_class.class_no,
                  total_batches: one_class.total_batches,
                  students_per_batch: one_class.students_per_batch,
                  branch_id: one_class.branch_id,
                  branch_name: selected_branch.branch_name,
                  dept_id: selected_department.id,
                  dept_name: selected_department.department_name,
                }
                : cl
            )
          );
        }

        if (result.function_name === "create_class") {
          setAllClasses((prev: any) => [
            ...prev,
            {
              id: result.data[0].id,
              class_no: result.data[0].class_no,
              total_batches: result.data[0].total_batches,
              students_per_batch: result.data[0].students_per_batch,
              branch_id: result.data[0].branch_id,
              branch_name: selected_branch.branch_name,
              dept_id: selected_department.id,
              dept_name: selected_department.department_name,
            },
          ]);
        }
      } else {
        console.error("Error posting data:", result);
      }

      setIsModalOpen(false);
      setOneClass({
        id: 0,
        class_no: null,
        total_batches: null,
        students_per_batch: null,
        branch_id: 0,
      });
      router.refresh();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const get_class_data = all_classes.map((data, index) => {
    return (
      <div
        className="main_content group shadow-md relative justify-center items-center w-full font-bold rounded-sm"
        key={index}
        onClick={() => {
          setOneClass({
            id: data.id,
            class_no: data.class_no,
            total_batches: data.total_batches,
            students_per_batch: data.students_per_batch,
            branch_id: data.branch_id,
          });
          setSelectedDepartment({
            id: data.dept_id,
            department_name: data.dept_name,
            uni_id: Number(uni_id),
          });
          setSelectedBranch({
            id: data.branch_id,
            branch_name: data.branch_name,
            dept_id: data.dept_id,
            dept_name: data.dept_name,
          });
          setPreviousData({
            id: data.id,
            class_no: data.class_no,
            total_batches: data.total_batches,
            students_per_batch: data.students_per_batch,
            branch_id: data.branch_id,
            branch_name: data.branch_name,
            dept_name: data.dept_name,
            dept_id: data.dept_id,
          });
        }}
      >
        <div className="edit_delete opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-md group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-all duration-1000  flex  border-black justify-center items-center h-full p-2 w-full absolute">
          <button
            onClick={(e) => {
              handle_edit(data);
            }}
            className="flex gap-1 hover:text-green-600 border-r border-black p-2"
          >
            <FiEdit size={20} />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              handle_delete(data);
            }}
            className="flex gap-1 hover:text-red-600 p-2"
          >
            <FiTrash2 size={20} />
            <span>Delete</span>
          </button>
        </div>
        <div className="right_content w-full flex flex-col gap-0 p-5 ">
          <p className=" text-xl text-slate-950">
            Department : {data.dept_name}
          </p>
          <p className=" text-xl text-slate-950">Branch : {data.branch_name}</p>
          <p className=" text-xl text-slate-950">Class No : {data.class_no}</p>
          <p className=" text-xl text-slate-950">
            Total Batch : {data.total_batches}
          </p>
          <p className=" text-xl text-slate-950">
            Student Per Batch : {data.students_per_batch}
          </p>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
        <div className="flex justify-between w-full">
          <div></div>
          <div className="text-3xl font-bold text-slate-950">Class</div>
          <button
            onClick={handle_insert}
            className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
          >
            <FaPlus></FaPlus> <div>Add Class</div>
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-black">
              <div className="flex relative">
                <div className="flex-1 ">
                  <h1 className="text-lg font-bold mb-4">Add New Class</h1>
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
                  required
                  id="data"
                  type="text"
                  value={one_class.class_no || ""}
                  placeholder="Enter class no"
                  onChange={(e) =>
                    setOneClass({
                      ...one_class,
                      class_no: Number(e.target.value),
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <div ref={dropdownRef1} className="relative">
                  <input
                    type="text"
                    value={selected_department.department_name}
                    className={`bg-gray-50 border text-gray-900 rounded-md border-gray-300 block w-full mt-1 p-2.5`}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const filtered = all_department.filter((data) =>
                        data.department_name.toLowerCase().includes(inputValue.toLowerCase())
                      );

                      setFilteredDepartment(filtered);
                      setSelectedBranch({
                        id: 0,
                        branch_name: "",
                        dept_id: 0,
                        dept_name: "",
                      });

                      if (filtered.length === 0) {
                        setSelectedDepartment({ ...selected_department, department_name: "" });
                      } else {
                        setSelectedDepartment({
                          ...selected_department,
                          department_name: inputValue,
                        });
                      }
                    }}
                    placeholder="Department"
                    onFocus={() => setShowDropdown1(true)}
                  />
                  {showDropdown1 && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {filteredDepartment.length > 0 ? (
                        filteredDepartment.map((type, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                            onClick={() => {
                              setSelectedDepartment({
                                id: type.id,
                                department_name: type.department_name,
                                uni_id: type.uni_id,
                              });
                              setSelectedBranch({
                                id: 0,
                                branch_name: "",
                                dept_id: 0,
                                dept_name: "",
                              });
                              setShowDropdown1(false);
                              setFilteredBranches(
                                all_branches.filter((data) => data.dept_id === type.id)
                              );
                            }}
                          >
                            {type.department_name}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">No data found</div>
                      )}
                    </div>
                  )}
                </div>

                <div ref={dropdownRef2} className="relative">
                  <input
                    type="text"
                    value={selected_branch.branch_name}
                    className={`bg-gray-50 text-gray-900 rounded-md border border-gray-300 block w-full p-2.5 mt-1`}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const filtered = all_branches.filter((data) =>
                        data.branch_name.toLowerCase().includes(inputValue.toLowerCase())
                      );

                      setFilteredBranches(filtered);

                      if (filtered.length === 0) {
                        setSelectedBranch({ ...selected_branch, branch_name: "" });
                      } else {
                        setSelectedBranch({
                          ...selected_branch,
                          branch_name: inputValue,
                        });
                      }
                    }}
                    placeholder="Branch"
                    onFocus={() => setShowDropdown2(true)}
                  />
                  {showDropdown2 && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {filteredBranches.length > 0 ? (
                        filteredBranches.map((type, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                            onClick={() => {
                              setSelectedBranch({
                                id: type.id,
                                branch_name: type.branch_name,
                                dept_id: type.dept_id,
                                dept_name: type.dept_name,
                              });
                              setShowDropdown2(false);
                              setOneClass({ ...one_class, branch_id: type.id });
                            }}
                          >
                            {type.branch_name}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">No data found</div>
                      )}
                    </div>
                  )}
                </div>

                <>
                  {/* <div className="relative">
                  <select
                  required
                  value={selected_department.id || ""} // Controlled: use 'value'
                  onChange={(e) => {
                    const selectedDept = all_department.find(
                      (dept) => dept.id === parseInt(e.target.value)
                      );
                      setSelectedDepartment(
                        selectedDept || {
                          id: 0,
                          department_name: "",
                          uni_id: 0,
                          }
                      );
                      setSelectedBranch({
                        id: 0,
                        branch_name: "",
                        dept_id: 0,
                        dept_name: "",
                        });
                        setBranches(
                          selectedDept
                          ? all_branches.filter(
                              (branch) => branch.dept_id === selectedDept.id
                            )
                          : []
                      );
                      }}
                    className="border rounded-md px-2 py-1 w-full"
                  >
                    <option value="" disabled>
                    Select Department
                    </option>
                    {all_department.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                  
                  <div className="relative mt-4">
                    <select
                    required
                    value={selected_branch.id || ""} // Controlled: use 'value'
                    onChange={(e) => {
                        const selectedBranch = branches.find(
                          (branch) => branch.id === parseInt(e.target.value)
                          );
                        setSelectedBranch(
                          selectedBranch || {
                            id: 0,
                            branch_name: "",
                            dept_id: 0,
                            dept_name: "",
                            }
                            );
                            setOneClass({
                              ...one_class,
                              branch_id: selectedBranch?.id || 0,
                              });
                              }}
                              className="border rounded-md px-2 py-1 w-full"
                              disabled={branches.length === 0}
                              >
                              <option value="" disabled>
                              Select Branch
                              </option>
                              {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.branch_name}
                        </option>
                      ))}
                    </select>
                    </div>
                </div> */}
                </>

                <input
                  required
                  id="data"
                  type="text"
                  value={one_class.total_batches || ""}
                  placeholder="Enter Total Batches"
                  onChange={(e) =>
                    setOneClass({
                      ...one_class,
                      total_batches: Number(e.target.value),
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <input
                  required
                  id="data"
                  type="text"
                  value={one_class.students_per_batch || ""}
                  placeholder="Enter Student per batch"
                  onChange={(e) =>
                    setOneClass({
                      ...one_class,
                      students_per_batch: Number(e.target.value),
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <div className="mt-4">
                  <button
                    disabled={
                      !one_class.class_no ||
                      !one_class.total_batches ||
                      !one_class.students_per_batch ||
                      !selected_department.id ||
                      !selected_branch.id
                    }
                    type="submit"
                    className={`${one_class.class_no && one_class.total_batches && one_class.students_per_batch && selected_department.id && selected_branch.id
                      ? "bg-blue-500"
                      : "bg-gray-300 cursor-not-allowed"
                      } disabled:cursor-not-allowed text-white px-4 py-2 rounded-md`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 w-full gap-5">
          {all_classes[0].id > 0 && all_classes !== null
            ? get_class_data
            : null}
        </div>
      </div>
    </>
  );
};

export default page;
