// src/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import CustomDropdown from "./dropdown";
import { IoClose, IoFilter, IoSearch } from "react-icons/io5";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const Page = () => {
  const [data, setData] = useState({
    department: {
      id: 0,
      department_name: "",
    },
    branch: {
      id: 0,
      branch_name: "",
      dept_id: 0,
    },
    classes: {
      id: 0,
      class_no: 0,
      branch_id: 0,
      branch_name: "",
      dept_name: "",
      total_batches: 0,
      students_per_batch: 0,
    },
    semester: {
      id: 0,
      sem_no: "",
      class_id: 0,
    },
    resource: [
      {
        capacity: 0,
        resource_type: "",
        resource_name: "",
      },
    ],
    subject: [
      {
        id: 0,
        subject_name: "",
        faculty_id: 0,
        faculty_name: "",
        resource_required: [
          {
            resource_type: "",
            resource_count: 0,
          },
        ],
        uni_id: 0,
      },
    ],
  });
  const [showModal, setShowModal] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const handleResourceChange = (resourceType: any, resourceName: any) => {
    // Check if the resource is already in the data
    const isSelected = data.resource.some(
      (r) => r.resource_name === resourceName
    );

    if (isSelected) {
      // Remove the resource if it is already selected
      setData((prevData) => ({
        ...prevData,
        resource: prevData.resource.filter(
          (r) => r.resource_name !== resourceName
        ),
      }));
    } else {
      // Add the resource if it is not selected
      setData((prevData) => ({
        ...prevData,
        resource: [
          ...prevData.resource,
          {
            capacity: 0,
            resource_type: resourceType,
            resource_name: resourceName,
          },
        ],
      }));
    }
  };

  const [department, setDepartment] = useState([
    {
      id: 0,
      department_name: "",
      uni_id: 0,
    },
  ]);
  const [branch, setBranch] = useState([
    {
      id: 0,
      branch_name: "",
      dept_id: 0,
      dept_name: "",
    },
  ]);
  const [classs, setClass] = useState([
    {
      id: 0,
      class_no: 0,
      branch_id: 0,
      total_batches: 0,
      students_per_batch: 0,
      branch_name: "",
      dept_name: "",
    },
  ]);
  const [semester, setSemester] = useState([
    {
      id: 0,
      sem_no: "",
      class_id: 0,
      subject_faculty: [
        {
          subject_id: 0,
          subject_name: "",
          faculty_id: 0,
          faculty_name: "",
        },
      ],
    },
  ]);
  const [subject_faculty, setSubject_Faculty] = useState([
    {
      id: 0,
      subject_name: "",
      faculty_id: 0,
      faculty_name: "",
      resource_required: [
        {
          resource_type: "",
          resource_count: 0,
        },
      ],
      uni_id: 0,
    },
  ]);
  const [uni_id, setUni_id] = useState("");
  const [allResource, setAllResource] = useState([
    {
      id: 0,
      capacity: 0,
      resource_name: "",
      resource_type: "",
    },
  ]);
  const [filterResoruce, setFilterResource] = useState([
    {
      id: 0,
      capacity: 0,
      resource_name: "",
      resource_type: "",
    },
  ]);
  const resourceOptions = [
    ...new Set(allResource.map((res) => res.resource_type)),
  ];
  const departmentOptions = department.map((dept) => dept.department_name);
  const branchOptions = [
    ...new Set(
      branch
        .filter((bran) => {
          return bran.dept_name === data.department.department_name;
        })
        .map((bran) => bran.branch_name) // Extract branch names
    ),
  ];
  const classOptions = [
    ...new Set(
      classs
        .filter((cl) => {
          return cl.branch_id == data.branch.id;
        })
        .map((cl) => cl.class_no)
    ),
  ];
  const semesterOptions = [
    ...new Set(
      semester
        .filter((sem) => {
          return sem.class_id === data.classes.id;
        })
        .map((sem) => sem.sem_no)
    ),
  ];

  // Fetch university ID on load
  useEffect(() => {
    get_uni_id();
    setData((prev) => ({
      ...prev,
      resource: prev.resource.filter(
        (res) => res.resource_name && res.resource_type
      ),
    }));
  }, []);

  // get university ID from the URL
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

    await getAllDepartments(customData);
    await getAllBranch(customData);
    await getAllClasses(customData);
    await getAllSemester(customData);
    await getAllResources(customData);
  };

  // Fetch all departments
  const getAllDepartments = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/department`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      setDepartment(data.data);
    } else {
      setDepartment([]);
    }
  };

  // Fetch all branches
  const getAllBranch = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/branch`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      setBranch(data.data);
    } else {
      console.log("No data");
      setBranch([]);
    }
  };

  // fetch all classes
  const getAllClasses = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/class`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      setClass(data.data);
    } else {
      console.log("No data");
      setClass([]);
    }
  };
  // fetch all semester
  const getAllSemester = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/semester`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      setSemester(data.data);
    } else {
      console.log("No data");
      setSemester([]);
    }
  };

  // fetch all resource
  const getAllResources = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/resource`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      setAllResource(data.data);
      setFilterResource(data.data);
    } else {
      setAllResource([]);
    }
  };

  const sendData = async () => {
    console.log(data)
    // const response = await fetch("http://localhost:3000/api/timetable", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });

    // const res = await response.json();
  };
  return (
    <div className="text-black flex justify-center">
      <div className="pt-10 flex " onClick={() => setShowModal(true)}>
        <button className="relative  flex h-[50px] w-40 items-center justify-center overflow-hidden bg-[#BBE1FA] font-medium text-[#1B262C] shadow-2xl transition-all duration-300 before:absolute before:inset-0 before:border-0 before:border-[#0F4C75] before:duration-100 before:ease-linear hover:bg-[#1B262C] hover:text-[#BBE1FA] rounded-lg">
          <span className="relative z-10">Create Time Table</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed z-10 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-[50vw] p-5 rounded-md">
            <div className="flex relative">
              <div className="flex-1 text-center ">
                <h1 className="text-2xl font-bold">Create TimeTable</h1>
                <p className="text-gray-400 text-sm">
                  Add details required for generating the timetable!
                </p>
              </div>
              <div className="absolute right-0">
                <button
                  className="hover:text-red-500"
                  onClick={() => setShowModal(false)}
                >
                  <IoClose size={30} />
                </button>
              </div>
            </div>

            <div className="m-5">
              <div className="flex">
                <div className="m-2 flex-[0.9]">
                  <CustomDropdown
                    label="Department"
                    options={departmentOptions}
                    value={data.department.department_name}
                    disabled={false}
                    onChange={(value: any) =>
                      setData({
                        ...data,
                        department: {
                          id:
                            value === ""
                              ? 0
                              : department.filter(
                                  (dept) => dept.department_name === value
                                )[0].id,
                          department_name: value,
                        },
                      })
                    }
                  />
                </div>
                <div className="m-2 flex-1">
                  <CustomDropdown
                    label="Branch"
                    options={branchOptions}
                    disabled={
                      data.department.department_name === "" ||
                      data.department.department_name === "Select department"
                    }
                    value={data.branch.branch_name}
                    onChange={(value: any) =>
                      setData({
                        ...data,
                        branch: {
                          id:
                            value === ""
                              ? 0
                              : branch.filter(
                                  (bran) =>
                                    bran.branch_name === value &&
                                    bran.dept_name ===
                                      data.department.department_name
                                )[0].id,
                          branch_name: value,
                          dept_id:
                            value === ""
                              ? 0
                              : branch.filter(
                                  (bran) => bran.branch_name === value
                                )[0].dept_id,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex">
                <div className="m-2 flex-[0.9]">
                  <CustomDropdown
                    label="Class"
                    options={classOptions}
                    value={data.classes.class_no}
                    disabled={
                      data.branch.branch_name === "" ||
                      data.branch.branch_name === "Select branch"
                    }
                    onChange={(value: any) =>
                      setData({
                        ...data,
                        classes: {
                          id:
                            value === ""
                              ? 0
                              : classs.filter((cl) => cl.class_no == value)[0]
                                  .id,
                          class_no: value,
                          branch_id:
                            value === ""
                              ? 0
                              : classs.filter((cl) => cl.class_no === value)[0]
                                  .branch_id,
                          total_batches:
                            value === ""
                              ? 0
                              : classs.filter((cl) => cl.class_no === value)[0]
                                  .total_batches,
                          students_per_batch:
                            value === ""
                              ? 0
                              : classs.filter((cl) => cl.class_no === value)[0]
                                  .students_per_batch,
                          branch_name:
                            value === ""
                              ? ""
                              : classs.filter((cl) => cl.class_no === value)[0]
                                  .branch_name,
                          dept_name:
                            value === ""
                              ? ""
                              : classs.filter((cl) => cl.class_no === value)[0]
                                  .dept_name,
                        },
                      })
                    }
                  />
                </div>
                <div className="m-2 flex-1">
                  <CustomDropdown
                    label="Semester"
                    options={semesterOptions}
                    disabled={data.classes.class_no === 0}
                    value={data.semester.sem_no}
                    onChange={(value: any) =>
                      setData({
                        ...data,
                        semester: {
                          id:
                            value === ""
                              ? 0
                              : semester.filter(
                                  (sem) => sem.sem_no === value
                                )[0].id,
                          sem_no: value,
                          class_id:
                            value === ""
                              ? 0
                              : semester.filter(
                                  (sem) => sem.sem_no === value
                                )[0].class_id,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end m-5">
              <button
                className=" bg-gray-700 text-white gap-2 hover:bg-gray-800 transition flex justify-center items-center px-3 py-2 rounded-sm disabled:opacity-45 disabled:cursor-not-allowed"
                disabled={
                  data.department.department_name == "" ||
                  data.branch.branch_name == "" ||
                  data.classes.class_no == 0 ||
                  data.semester.sem_no == ""
                    ? true
                    : false
                }
                onClick={() => {
                  setShowModal(false);
                  setShowModal2(true);

                  semester
                    .filter((sem) => {
                      return sem.id === data.semester.id;
                    })[0]
                    .subject_faculty.map((sub_fac, index) => {
                      if (index == 0) {
                        setSubject_Faculty((prev) => [
                          {
                            id: sub_fac.subject_id,
                            subject_name: sub_fac.subject_name,
                            faculty_id: sub_fac.faculty_id,
                            faculty_name: sub_fac.faculty_name,
                            resource_required: [
                              {
                                resource_type: "",
                                resource_count: 0,
                              },
                            ],
                            uni_id: Number(uni_id),
                          },
                        ]);
                      } else {
                        setSubject_Faculty((prev) => [
                          ...prev,
                          {
                            id: sub_fac.subject_id,
                            subject_name: sub_fac.subject_name,
                            faculty_id: sub_fac.faculty_id,
                            faculty_name: sub_fac.faculty_name,
                            resource_required: [
                              {
                                resource_type: "",
                                resource_count: 0,
                              },
                            ],
                            uni_id: Number(uni_id),
                          },
                        ]);
                      }
                    });
                }}
              >
                Next
                <span>
                  <FaArrowRightLong />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal2 && (
        <div className="fixed z-10 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5  rounded-md">
            <div className="flex relative">
              <div className="flex-1 text-center ">
                <h1 className="text-2xl font-bold">Create TimeTable</h1>
                <p className="text-gray-400 text-sm">
                  Add details required for generating the timetable!
                </p>
              </div>
              <div className="absolute right-0">
                <button
                  className="hover:text-red-500"
                  onClick={() => setShowModal2(false)}
                >
                  <IoClose size={30} />
                </button>
              </div>
            </div>

            {/* subject and faculty wise resource */}
            <div className="">
              {subject_faculty.map((sub_fac, subindex) => {
                return (
                  <div key={subindex} className="p-1 ">
                    <div className="flex gap-2 items-baseline">
                      <div className="font-bold  text-lg ">
                        {sub_fac.subject_name}
                      </div>

                      <div className="text-sm text-gray-400 ">
                        {sub_fac.faculty_name}
                      </div>
                    </div>
                    <div className="flex gap-4 py-1 ">
                      {resourceOptions.map((res, index) => {
                        return (
                          <div className="flex flex-col relative " key={index}>
                            <label className="absolute text-xs text-gray-500 left-2 bg-white px-1 -top-2">
                              {res}
                            </label>
                            <input
                              type="text"
                              className="border-2 border-gray-300 p-1.5 rounded-md"
                              placeholder="Enter count"
                              onChange={(e) => {
                                const newSubject = [...subject_faculty];
                                newSubject[subindex].resource_required[index] =
                                  {
                                    resource_type: res,
                                    resource_count: parseInt(e.target.value),
                                  };
                                setSubject_Faculty(newSubject);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between m-5">
              <button
                className=" bg-gray-700 text-white gap-2 hover:bg-gray-800 transition flex justify-center items-center px-3 py-2 rounded-sm "
                onClick={() => {
                  setShowModal2(false);
                  setShowModal(true);
                }}
              >
                <span>
                  <FaArrowLeftLong />
                </span>
                Prev
              </button>
              <button
                className=" bg-gray-700 text-white gap-2 hover:bg-gray-800 transition flex justify-center items-center px-3 py-2 rounded-sm disabled:opacity-45 disabled:cursor-not-allowed"
                onClick={() => {
                  setShowModal2(false);
                  setShowModal3(true);
                }}
              >
                Next
                <span>
                  <FaArrowRightLong />
                </span>
              </button>
              {/* <button
                className="bg-green-600 p-2 rounded-md"
                onClick={() => {
                  setShowModal(false);
                  setData({
                    ...data,
                    subject: subject_faculty,
                  });
                }}
              >
                Save
              </button> */}
            </div>
          </div>
        </div>
      )}

      {showModal3 && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white w-fit p-5 rounded-md shadow-lg">
            <div className="flex relative">
              <div className="flex-1 text-center ">
                <h1 className="text-2xl font-bold">Create TimeTable</h1>
                <p className="text-gray-400 text-sm">
                  Add details required for generating the timetable!
                </p>
              </div>
              <div className="absolute right-0">
                <button
                  className="hover:text-red-500"
                  onClick={() => setShowModal3(false)}
                >
                  <IoClose size={30} />
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col gap-3">
                <div className="flex justify-center items-center gap-2">
                  <div className="flex w-[80%] border border-gray-300 hover:ring-2 hover:ring-gray-700 rounded-lg p-2 my-2 items-center">
                    <div>
                      <IoSearch size={20} />
                    </div>
                    <input
                      type="text"
                      className="rounded-md w-full text-black focus:outline-none px-2"
                      placeholder="Search Resource"
                      onChange={(e) => {
                        setFilterResource(
                          allResource.filter((res) =>
                            res.resource_name
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                          )
                        );
                      }}
                    />
                  </div>
                  <div className="p-2.5 border border-gray-300 hover:ring-2 hover:ring-gray-700 rounded-lg cursor-pointer">
                    <IoFilter size={20} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {resourceOptions.map((resType) => (
                    <div key={resType}>
                      <div className="font-semibold text-lg mb-2">
                        {resType}
                      </div>
                      <div className="grid grid-cols-5 gap-4">
                        {filterResoruce.length > 0 &&
                        filterResoruce.filter((r) => {
                          return r.resource_type === resType;
                        }) ? (
                          filterResoruce.map((allres) =>
                            allres.resource_type === resType ? (
                              <div
                                key={allres.id}
                                className="flex items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm hover:shadow-md"
                              >
                                <input
                                  type="checkbox"
                                  checked={data.resource.some(
                                    (r) =>
                                      r.resource_name === allres.resource_name
                                  )}
                                  className="accent-green-600 h-5 w-5 cursor-pointer"
                                  onChange={() => {
                                    handleResourceChange(
                                      allres.resource_type,
                                      allres.resource_name
                                    );
                                  }}
                                />
                                <label className="text-gray-700">
                                  {allres.resource_name}
                                </label>
                              </div>
                            ) : null
                          )
                        ) : (
                          <span className="text-gray-400 ">
                            No resources found
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between m-5 w-full">
                <button
                  className=" bg-gray-700 text-white gap-2 hover:bg-gray-800 transition flex justify-center items-center px-3 py-2 rounded-sm "
                  onClick={() => {
                    setShowModal3(false);
                    setShowModal2(true);
                  }}
                >
                  <span>
                    <FaArrowLeftLong />
                  </span>
                  Prev
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  onClick={() => {
                    setShowModal3(false);
                    sendData();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
