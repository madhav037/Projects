"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const SemesterPage = () => {
  const [uni_id, setUni_id] = useState("");
  const [semester_id, setSemester_id] = useState(0);
  const [semesterData, setSemesterData] = useState([
    {
      id: 0,
      sem_no: 0,
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

  const [semester, setSemester] = useState<{
    id: number | null;
    sem_no: string;
    class_id: number | null;
    subject_faculty: {
      subject_id: number;
      subject_name: string;
      faculty_id: number;
      faculty_name: string;
    }[];
  }>({
    id: null,
    sem_no: "",
    class_id: null,
    subject_faculty: [],
  });

  const [subjects, setSubjects] = useState([
    {
      id: 0,
      subject_name: "",
      uni_id: 0,
    },
  ]);

  const [faculties, setFaculties] = useState([
    {
      id: 0,
      faculty_name: "",
      uni_id: 0,
    },
  ]);
  const [selectedSuject_Faculty, setSelectedSubject_Faculty] = useState({
    subject_id: 0,
    subject_name: "",
    faculty_id: 0,
    faculty_name: "",
  });
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const subjectdropdownRef = useRef<HTMLDivElement>(null);
  const facultydropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState<{
    sem_no: number;
    class_id: number;
    subject_faculty: {
      subject_id: number;
      subject_name: string;
      faculty_id: number;
      faculty_name: string;
    }[];
  }>({
    sem_no: 0,
    class_id: 0,
    subject_faculty: [],
  });

  const dept_id = params.department;
  const branch_id = params.branch;
  const class_id = params.class;

  useEffect(() => {
    get_uni_id();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        subjectdropdownRef.current &&
        !subjectdropdownRef.current.contains(event.target as Node)
      ) {
        setShowSubjectDropdown(false);
      }
      if (
        facultydropdownRef.current &&
        !facultydropdownRef.current.contains(event.target as Node)
      ) {
        setShowFacultyDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [subjectdropdownRef, facultydropdownRef]);

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

    await getSemesterData(customData);
    await fetchSubjects(customData);
    await fetchFaculties(customData);
  };

  const getSemesterData = async (uni_id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/semester`
    );
    const data = await response.json();
    // console.log(`http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/semester`)
    if (Array.isArray(data.data)) {
      setSemesterData(data.data);
      console.log("sesm ", semesterData);
    } else {
      setSemesterData([]);
    }
    await getSubjectName();
  };

  const fetchSubjects = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/subject`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setSubjects(data.data);
    } else {
      console.log("No subjects found");
    }
  };

  const fetchFaculties = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/faculty`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setFaculties(data.data);
    } else {
      console.log("No faculties found");
    }
  };

  const getSubjectName = async () => {
    return semesterData.map(async (data) => {
      console.log("dataaa:", data);
      return data.subject_faculty.map(async (subject: any) => {
        const subject_id = subject.subject_id;
        const response = await fetch(
          `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/subject/${subject_id}`
        );
        const data = await response.json();
        return data.data[0].subject_name;
      });
    });
  };
  // console.log(getSubjectName());

  const handle_delete = async (semester_id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/semester/${semester_id}`,
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
      setSemesterData(semesterData.filter((data) => data.id !== semester_id));
      router.refresh();
    } else {
      console.error("Error deleting data:", data);
    }
  };

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (sem_no: any, class_id: any, subject_faculty: any) => {
    setIsModalOpen(true);
    setInputData({ sem_no, class_id, subject_faculty });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(semester);

    e.preventDefault();
    try {
      const url =
        semester_id === 0
          ? `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/semester`
          : `http://localhost:3000/api/university/${uni_id}/department/${dept_id}/branch/${branch_id}/class/${class_id}/semester/${semester_id}`;

      const method = semester_id === 0 ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sem_no: inputData.sem_no,
          class_id: inputData.class_id,
          subject_faculty: inputData.subject_faculty,
        }),
      });
      const result = await response.json();
      console.log("Data successfully posted:", result);

      if (result.function_name === "update_semester") {
        setSemesterData((prevSemester: any) =>
          prevSemester.map((sem: any) =>
            sem.id === semester_id ? { ...sem, ...inputData } : sem
          )
        );
      }

      if (result.function_name === "create_semester") {
        setSemesterData((prevSemester) => [...prevSemester, result.data[0]]);
      }

      setIsModalOpen(false);
      setInputData({
        sem_no: 0,
        class_id: 0,
        subject_faculty: [],
      });
      setSemester_id(0);
      router.refresh();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const get_semester_data = semesterData.map((data, index) => (
    <div
      className="main_content group shadow-md relative justify-center items-center w-full font-bold rounded-sm"
      key={index}
    >
      <div className="edit_delete opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-md group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-all duration-1000  flex  border-black justify-center items-center h-full p-2 w-full absolute">
        <button
          onClick={() => {
            handle_edit(data.sem_no, data.class_id, data.subject_faculty);
            setSemester_id(data.id);
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
        <p className="text-2xl text-slate-950">Sem : {data.sem_no}</p>
        <p className="text-2xl text-slate-950">Class ID : {data.class_id}</p>
        {data.subject_faculty.map((name) => name.subject_name).join(", ")}
      </div>
    </div>
  ));

  return (
    <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
      <div className="flex justify-between w-full">
        <div className="text-3xl font-bold text-slate-950">Semester</div>
        <button
          onClick={handle_insert}
          className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
        >
          <FaPlus /> <div>New</div>
        </button>

        {isModalOpen && (
          <div className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <div className="flex relative">
                <div className="flex-1 ">
                  <h1 className="text-lg font-bold mb-4">Add New Department</h1>
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
                <label className="text-sm font-semibold">Semester No.</label>
                <input
                  type="number"
                  value={inputData.sem_no || ""}
                  placeholder="Enter Semester Number"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      sem_no: Number(e.target.value),
                    })
                  }
                  className="mb-3 p-2 border border-gray-300 rounded-md w-full"
                />
                <label className="text-sm font-semibold">Class ID</label>
                <input
                  type="number"
                  value={inputData.class_id || ""}
                  placeholder="Enter Class ID"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      class_id: Number(e.target.value),
                    })
                  }
                  className="mb-3 p-2 border border-gray-300 rounded-md w-full"
                />

                {semester.subject_faculty.map((sub_fac, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                      {sub_fac.subject_name}
                    </div>
                    <div className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                      {sub_fac.faculty_name}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSemester({
                          ...semester,
                          subject_faculty: semester.subject_faculty.filter(
                            (sub) => sub !== sub_fac
                          ),
                        })
                      }
                      className="text-black border border-red-600 px-4 py-2 m-1 rounded-md"
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
                <div className="flex gap-4">
                  <div ref={subjectdropdownRef} className="">
                    <input
                      type="text"
                      value={selectedSuject_Faculty.subject_name}
                      onChange={(e) =>
                        setSelectedSubject_Faculty({
                          ...selectedSuject_Faculty,
                          subject_name: e.target.value,
                        })
                      }
                      placeholder="Subject"
                      onFocus={() => setShowSubjectDropdown(true)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                    {showSubjectDropdown && (
                      <div className=" top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                        {subjects.map((sub, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                            onClick={() => {
                              setSelectedSubject_Faculty({
                                ...selectedSuject_Faculty,
                                subject_id: sub.id,
                                subject_name: sub.subject_name,
                              });

                              setShowSubjectDropdown(false);
                            }}
                          >
                            {sub.subject_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div ref={facultydropdownRef} className="relative">
                    <input
                      type="text"
                      value={selectedSuject_Faculty.faculty_name}
                      onChange={(e) =>
                        setSelectedSubject_Faculty({
                          ...selectedSuject_Faculty,
                          faculty_name: e.target.value,
                        })
                      }
                      placeholder="Faculty"
                      onFocus={() => setShowFacultyDropdown(true)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                    {showFacultyDropdown && (
                      <div className=" top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                        {faculties.map((fac, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                            onClick={() => {
                              setSelectedSubject_Faculty({
                                ...selectedSuject_Faculty,
                                faculty_id: fac.id,
                                faculty_name: fac.faculty_name,
                              });

                              setShowFacultyDropdown(false);
                            }}
                          >
                            {fac.faculty_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSemester({
                        ...semester,
                        subject_faculty: [
                          ...semester.subject_faculty,
                          selectedSuject_Faculty,
                        ],
                      });

                      setInputData({
                        ...inputData,
                        subject_faculty: [
                          ...inputData.subject_faculty,
                          selectedSuject_Faculty,
                        ],
                      });

                      setSelectedSubject_Faculty({
                        subject_id: 0,
                        subject_name: "",
                        faculty_id: 0,
                        faculty_name: "",
                      });
                    }}
                    className="text-black w-full border-dashed border border-black px-4 py-2 rounded-md"
                  >
                    Add Subject
                  </button>
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
      <div className="grid grid-cols-3 gap-3 w-full">{get_semester_data}</div>
    </div>
  );
};

export default SemesterPage;
