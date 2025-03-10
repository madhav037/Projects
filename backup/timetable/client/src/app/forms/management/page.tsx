// "use client";
// import React, { useState } from "react";
// import { IoClose } from "react-icons/io5";
// import { LuPencil } from "react-icons/lu";

// export default function ManagementPage() {
//   // Department form states
//   const [department, setDepartment] = useState({ departmentName: "" });
//   const [departmentList, setDepartmentList] = useState<
//     { departmentName: string }[]
//   >([]);
//   const [editingDepartmentIndex, setEditingDepartmentIndex] = useState<
//     number | null
//   >(null);

//   // Faculty form states
//   const [faculty, setFaculty] = useState({ facultyName: "" });
//   const [facultyList, setFacultyList] = useState<{ facultyName: string }[]>([]);
//   const [editingFacultyIndex, setEditingFacultyIndex] = useState<number | null>(
//     null
//   );

//   // Subject form states
//   const [subject, setSubject] = useState({ subjectName: "" });
//   const [subjectList, setSubjectList] = useState<{ subjectName: string }[]>([]);
//   const [editingSubjectIndex, setEditingSubjectIndex] = useState<number | null>(
//     null
//   );

//   // Input change handlers for each form
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     formSetter: any
//   ) => {
//     const { name, value } = e.target;
//     formSetter((prev: any) => ({ ...prev, [name]: value }));
//   };

//   // Add or edit logic for departments
//   const addDepartment = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (department.departmentName) {
//       if (editingDepartmentIndex !== null) {
//         const updatedDepartments = [...departmentList];
//         updatedDepartments[editingDepartmentIndex] = department;
//         setDepartmentList(updatedDepartments);
//         setEditingDepartmentIndex(null);
//       } else {
//         setDepartmentList((prev) => [...prev, department]);
//       }
//       setDepartment({ departmentName: "" });
//     } else {
//       alert("Please fill in the department name");
//     }
//   };
//   const saveAllDepartments = (e: React.MouseEvent) => {
//     e.preventDefault();
//     console.log(departmentList);
//   };

//   // Add or edit logic for faculties
//   const addFaculty = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (faculty.facultyName) {
//       if (editingFacultyIndex !== null) {
//         const updatedFaculties = [...facultyList];
//         updatedFaculties[editingFacultyIndex] = faculty;
//         setFacultyList(updatedFaculties);
//         setEditingFacultyIndex(null);
//       } else {
//         setFacultyList((prev) => [...prev, faculty]);
//       }
//       setFaculty({ facultyName: "" });
//     } else {
//       alert("Please fill in the faculty name");
//     }
//   };

//   const saveAllFaculties = (e: React.MouseEvent) => {
//     e.preventDefault();
//     console.log(departmentList);
//   };

//   // Add or edit logic for subjects
//   const addSubject = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (subject.subjectName) {
//       if (editingSubjectIndex !== null) {
//         const updatedSubjects = [...subjectList];
//         updatedSubjects[editingSubjectIndex] = subject;
//         setSubjectList(updatedSubjects);
//         setEditingSubjectIndex(null);
//       } else {
//         setSubjectList((prev) => [...prev, subject]);
//       }
//       setSubject({ subjectName: "" });
//     } else {
//       alert("Please fill in the subject name");
//     }
//   };

//   const saveAllSubjects = (e: React.MouseEvent) => {
//     e.preventDefault();
//     console.log(departmentList);
//   };

//   // Delete handlers for each form
//   const deleteEntry = (index: number, setList: any) => {
//     setList((prev: any) => prev.filter((_: any, i: any) => i !== index));
//   };

//   // Edit handlers for each specific form
//   const editDepartmentEntry = (index: number) => {
//     setDepartment(departmentList[index]);
//     setEditingDepartmentIndex(index);
//   };

//   const editFacultyEntry = (index: number) => {
//     setFaculty(facultyList[index]);
//     setEditingFacultyIndex(index);
//   };

//   const editSubjectEntry = (index: number) => {
//     setSubject(subjectList[index]);
//     setEditingSubjectIndex(index);
//   };

//   return (
//     <div className="h-fit flex flex-col items-center justify-center p-5 overflow-auto">
//       <div className="w-[90vw] max-w-3xl bg-white shadow-lg rounded-2xl px-10 py-6 space-y-8">
//         {/* Department Form */}
//         <div className="text-center font-bold text-2xl text-gray-900">
//           Add Department
//         </div>
//         <form className="flex flex-col gap-4 text-black">
//           <input
//             type="text"
//             name="departmentName"
//             value={department.departmentName}
//             onChange={(e) => handleInputChange(e, setDepartment)}
//             placeholder="Department Name"
//           />
//           <div className="flex space-x-4">
//             <button
//               onClick={addDepartment}
//               name="addDepartment"
//               className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-bold mt-4"
//               type="button"
//             >
//               {editingDepartmentIndex !== null
//                 ? "Save Changes"
//                 : "Add Department"}
//             </button>
//             <button
//               onClick={saveAllDepartments}
//               className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md font-bold mt-4"
//               type="submit"
//             >
//               Save All Departments
//             </button>
//           </div>
//           <div className="flex flex-wrap">
//             {departmentList.map((dept, index) => (
//               <div
//                 key={index}
//                 className="p-4 border border-gray-300 m-1 rounded"
//               >
//                 <span>{dept.departmentName} </span>
//                 <button onClick={() => editDepartmentEntry(index)}>
//                   <LuPencil size={16} />
//                 </button>
//                 <button onClick={() => deleteEntry(index, setDepartmentList)}>
//                   <IoClose size={20} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </form>

//         {/* Faculty Form */}
//         <div className="text-center font-bold text-2xl text-gray-900">
//           Add Faculty
//         </div>
//         <form className="flex flex-col gap-4 text-black">
//           <input
//             type="text"
//             name="facultyName"
//             value={faculty.facultyName}
//             onChange={(e) => handleInputChange(e, setFaculty)}
//             placeholder="Faculty Name"
//           />
//           <button
//             onClick={addFaculty}
//             className="bg-blue-500 text-white py-2 px-4 rounded"
//           >
//             {editingFacultyIndex !== null ? "Save Changes" : "Add Faculty"}
//           </button>
//           <div className="flex space-x-4">
//             <button
//               onClick={addFaculty}
//               name="addFaculty"
//               className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-bold mt-4"
//               type="button"
//             >
//               {editingFacultyIndex !== null ? "Save Changes" : "Add Faculty"}
//             </button>
//             <button
//               onClick={saveAllFaculties}
//               className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md font-bold mt-4"
//               type="submit"
//             >
//               Save All Faculties
//             </button>
//           </div>
//           <div className="flex flex-wrap">
//             {facultyList.map((fac, index) => (
//               <div
//                 key={index}
//                 className="p-4 border border-gray-300 m-1 rounded"
//               >
//                 <span>{fac.facultyName} </span>
//                 <button onClick={() => editFacultyEntry(index)}>
//                   <LuPencil size={16} />
//                 </button>
//                 <button onClick={() => deleteEntry(index, setFacultyList)}>
//                   <IoClose size={20} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </form>

//         {/* Subject Form */}
//         <div className="text-center font-bold text-2xl text-gray-900">
//           Add Subject
//         </div>
//         <form className="flex flex-col gap-4 text-black">
//           <input
//             type="text"
//             name="subjectName"
//             value={subject.subjectName}
//             onChange={(e) => handleInputChange(e, setSubject)}
//             placeholder="Subject Name"
//           />
          
//           <div className="flex space-x-4">
//             <button
//               onClick={addSubject}
//               name="addSubject"
//               className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-bold mt-4"
//               type="button"
//             >
//               {editingSubjectIndex !== null ? "Save Changes" : "Add Subject"}
//             </button>
//             <button
//               onClick={saveAllSubjects}
//               className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md font-bold mt-4"
//               type="submit"
//             >
//               Save All Subjects
//             </button>
//           </div>
//           <div className="flex flex-wrap">
//             {subjectList.map((sub, index) => (
//               <div
//                 key={index}
//                 className="p-4 border border-gray-300 m-1 rounded"
//               >
//                 <span>{sub.subjectName} </span>
//                 <button onClick={() => editSubjectEntry(index)}>
//                   <LuPencil size={16} />
//                 </button>
//                 <button onClick={() => deleteEntry(index, setSubjectList)}>
//                   <IoClose size={20} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
