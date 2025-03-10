import {
  fillAllocator,
  genAllocator,
  getAllocator,
  updateAllAllocators,
  updateAllocator,
} from "@/lib/resourceAllocator";
import { fillTimetable } from "@/lib/timetableHandler";
import { createTimetable } from "@/lib/timetableHandler";
import { supabase } from "@/lib/dbConnect";
import { create } from "domain";

export async function schedule(params: any) {
  // console.log(params);
  console.log("helloooooooooooooo");

  const initial_Subject_faculty = params.subject_faculty;
  let subject_faculty = structuredClone(initial_Subject_faculty);
  const selected_resource = params.resource;
  const total_batches = params.classes.total_batches;
  const students_per_batch = params.classes.students_per_batch;
  const { data: session, error: session_error } = await supabase
    .from("session")
    .select()
    .eq("dept_id", params.department.id);

  if (session_error) {
    console.log(session_error);
    return;
  }

  const number_of_session = session ? session.length : 0;

  const faculty = subject_faculty.map((sub_fac: any) => sub_fac.faculty_name);

  let faculty_allocator: any = [];

  for (const fac of faculty) {
    const fac_allocator = await getAllocator(params.uni_id, "Faculty", fac);
    faculty_allocator.push(fac_allocator);
  }

  faculty_allocator = faculty_allocator.map((fac: any) => fac[0]);

  const resource_type = selected_resource
    ? [...new Set(selected_resource.map((res: any) => res.resource_type))]
    : [];
  
  let res_all: any = [];

  for (const res_type of resource_type) {
    const resource_name = selected_resource
      ? selected_resource.filter((res: any) => res.resource_type === res_type)
      : [];

    const all_resource_name = resource_name.map(
      (res: any) => res.resource_name
    );
    let temp: any = [];

    for (const resName of all_resource_name) {
      try {
        const acc = await getAllocator(
          params.uni_id,
          res_type as string,
          resName as string
        );
        temp.push(acc);
      } catch (error) {
        console.error(`Failed to fetch allocator for ${resName}:`, error);
      }
    }

    res_all.push({
      resource_allocator: temp.map((res: any) => res[0]),
      res_type,
    });
  }

  const timeTable = createTimetable(5, number_of_session, [2]);
  // console.log("=========================== ",total_batches);

  let faculty_index = 0;
  let resource_index = 0;
  for (let b = 0; b < total_batches; b++) {
    console.log("batch ======= " + (b + 1));
    subject_faculty = structuredClone(initial_Subject_faculty);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < number_of_session; j++) {
        if (timeTable[i][j][0] == "null") {
          continue;
        }

        console.log("day", i, "session", j);

        // if (timeTable) {
        //     // all

        // }

        if (resource_index == resource_type.length) {
          resource_index = 0;
        }
        let flag = 0

        if (timeTable[i][j].length != 0) {
          let fill_sub_fac = same_fac_check(subject_faculty, i, j, timeTable, res_all, students_per_batch, selected_resource);
          // console.log(fill_sub_fac);

          if (fill_sub_fac != null) {
            fillTimetable(
              timeTable,
              i,
              j,
              fill_sub_fac.fac_name,
              fill_sub_fac.sub_name,
              b + 1,
              fill_sub_fac.res_name,
              fill_sub_fac.resource_type
            );
            flag = 1;
          }
        }

        if (flag == 0) {
          faculty_index = select_faculty(
            subject_faculty,
            faculty_allocator,
            resource_type[resource_index],
            i,
            j
          );
          while (faculty_index == -1 && resource_index < resource_type.length) {
            // console.log("gh");
            resource_index++;
            faculty_index = select_faculty(
              subject_faculty,
              faculty_allocator,
              resource_type[resource_index],
              i,
              j
            );
          }
          if (faculty_index != -1) {
            let r_i = res_all.findIndex(
              (res: any) => res.res_type == resource_type[resource_index]
            );

            let second_resource_index = select_resource(
              res_all,
              r_i,
              i,
              j
            );

            if (second_resource_index != -1) {
              fillTimetable(
                timeTable,
                i,
                j,
                subject_faculty[faculty_index].faculty_name,
                subject_faculty[faculty_index].subject_name,
                b + 1,
                res_all[r_i].resource_allocator[second_resource_index]
                  .name,
                resource_type[resource_index] as string
              );
              faculty_allocator[faculty_index].sessions[i][j] = 1;
              let res_name = res_all[r_i].resource_allocator[second_resource_index].name;
              let res_capacity = selected_resource.find((res: any) => res.resource_name == res_name).capacity;

              try {
                fillAllocator(
                  res_all[r_i].resource_allocator,
                  res_all[r_i].resource_allocator[second_resource_index]
                    .name,
                  i,
                  j,
                  res_capacity,
                  students_per_batch
                );

              } catch (err) {
                console.error("timepasss == ", err);
              }

              // res_all[resource_index].resource_allocator[second_resource_index].sessions[i][j] = 1;
              // console.log(
              //   "resource count",
              //   subject_faculty[faculty_index].resource_required[resource_index]
              //     .resource_count
              // );

              let fac_res_index = subject_faculty[faculty_index].resource_required.findIndex(
                (res: any) =>
                  res.resource_type == resource_type[resource_index]
              );
              // console.table(subject_faculty[faculty_index].faculty_name)
              // console.table(subject_faculty[faculty_index].resource_required[fac_res_index]);
              subject_faculty[faculty_index].resource_required[fac_res_index].resource_count--;
              resource_index++;
            }

            // console.log(second_resource_index);

          }
        }

      }
    }
    // console.log(timeTable);
  }
  try {
    // await updateAllocator({});
    await updateAllAllocators({
      uniId: params.uni_id,
      resourceType: "Auditorium",
      resourceAllocator: res_all[1].resource_allocator,
    });
    await updateAllAllocators({
      uniId: params.uni_id,
      resourceType: "Lab",
      resourceAllocator: res_all[0].resource_allocator,
    });
  } catch (error) {
    console.error("Error updating allocator:", error);
  }
  return timeTable;
}
// faculty check

const select_faculty = (
  subject_faculty: any,
  faculty_allocator: any,
  res_type: any,
  day: any,
  session: any
) => {
  // console.log("HELLO");

  let faculty = []
  for (let i = 0; i < subject_faculty.length; i++) {
    for (let j = 0; j < subject_faculty[i].resource_required.length; j++) {
      if (subject_faculty[i].resource_required[j].resource_type == res_type && subject_faculty[i].resource_required[j].resource_count > 0) {
        faculty.push(subject_faculty[i])
        // console.log(subject_faculty[i].resource_required[j].resource_count)
      }
    }
  }

  // console.log(res_type);
  // console.table(faculty);

  let available_faculty = [];

  for (let i = 0; i < faculty_allocator.length; i++) {
    for (let j = 0; j < faculty.length; j++) {
      if (faculty_allocator[i].name == faculty[j].faculty_name) {
        if (faculty_allocator[i].sessions[day][session] == 0) {
          available_faculty.push(faculty_allocator[i]);
        }
      }
    }
  }

  // console.log(available_faculty);

  if (available_faculty.length == 0) {
    return -1;
  }

  let random_index = Math.floor(Math.random() * available_faculty.length);

  let return_index = subject_faculty.findIndex(
    (fac: any) => fac.faculty_name == available_faculty[random_index].name
  );

  // console.log("Heyyyyyy");

  // console.table(subject_faculty[return_index]);

  return return_index;
};

const select_resource = (
  res_all: any,
  resource_index: any,
  day: any,
  session: any
) => {
  // console.log(res_all[resource_index].resource_allocator);

  // let res = res_all[resource_index].resource_allocator.filter(
  //   (res: any) => res.sessions[day][session] < 1
  // );
  let res: any = []
  for (let i = 0; i < res_all[resource_index].resource_allocator.length; i++) {
    if (res_all[resource_index].resource_allocator[i].sessions[day][session] < 1 && res_all[resource_index].resource_allocator[i].sessions[day][session] >= 0) {
      res.push(res_all[resource_index].resource_allocator[i])
    }
  }
  // console.log(res);

  let random_index = Math.floor(Math.random() * res.length);
  let res_name = res[random_index].name;
  let index = res_all[resource_index].resource_allocator.findIndex(
    (res: any) => res.name == res_name
  );
  return index;
};

// const faculty_check = (
//   faculty: any,
//   row: any,
//   col: any,
//   faculty_index: any
// ) => {
//   if (faculty[faculty_index].sessions[row][col] == 0) {
//     return true;
//   }

//   return false;
// };

// const resource_count_check = (subject_faculty: any): boolean => {
//   // console.log(subject_faculty);
//   for (let i = 0; i < subject_faculty.length; i++) {
//     let sub_fac = subject_faculty[i];
//     for (let j = 0; j < sub_fac.resource_required.length; j++) {
//       if (sub_fac.resource_required[j].resource_count > 0) {
//         return false;
//       }
//     }
//   }
//   return true;
// };

// // resource check
// function resource_check(
//   res_all: any,
//   session_index: number,
//   day_index: number,
//   res_type: string,
//   res_name: string
// ): number {
//   let result = 0;

//   let sameType = res_all.filter((res: any) => res.res_type == res_type);
//   sameType = sameType.map((res: any) => res.resource_allocator);

//   for (let i = 0; i < sameType.length; i++) {
//     let res = sameType[i];
//     for (let j = 0; j < res.length; j++) {
//       if (res[j].name == res_name) {
//         result = res[j].sessions[day_index][session_index];
//         return result;
//       }
//     }
//   }

//   return result;
// }

// same faculty check
function same_fac_check(
  subject_faculty: any,
  day: number,
  session: number,
  timeTable: any,
  res_all: any,
  students_per_batch: number,
  selected_resource: any
) {

  for (let i = 0; i < timeTable[day][session].length; i++) {
    const batch_object = timeTable[day][session][i];
    // console.log("batch_object :", batch_object);

    let faculty_index: any = subject_faculty.findIndex((fac: any) => fac.faculty_name == batch_object.fac_name)
    // console.log("faculty_index :", f_index);

    if (faculty_index == -1) {
      continue
    }

    let faculty_resource_index = subject_faculty[faculty_index].resource_required.findIndex((res: any) => res.resource_type == batch_object.resource_type)
    // console.log("resource_index :", r_index);

    if (faculty_resource_index == -1) {
      continue
    }

    // console.log("Hello", subject_faculty[f_index].resource_required);
    if (subject_faculty[faculty_index].resource_required[faculty_resource_index].resource_count > 0) {

      let resource_type_index = res_all.findIndex(
        (res: any) => res.res_type == batch_object.resource_type
      );
      // console.log("Byee");

      // console.log("res_index :", res_index);

      if (resource_type_index == -1) {
        continue;
      }

      let res_name = batch_object.resource_name;

      console.log('res_index : ', resource_type_index);
      console.log("res_name :", res_name);

      let second_r_index = res_all[resource_type_index].resource_allocator.findIndex(
        (res: any) => res.name == res_name
      );

      console.log("second_r_index", second_r_index);
      if (second_r_index == -1) {
        continue;
      }

      let res_capacity = selected_resource.find((res: any) => res.resource_name == res_name).capacity;
      console.log("res_capacity :", res_capacity);
      console.log(students_per_batch);

      if (res_all[resource_type_index].resource_allocator[second_r_index].sessions[day][session] + (students_per_batch / res_capacity) > 1) {
        continue;
      }

      try {
        fillAllocator(
          res_all[resource_type_index].resource_allocator,
          res_name,
          day,
          session,
          res_capacity,
          students_per_batch
        );
      } catch (err) {
        console.error("timepasss == ", err);
        continue;
      }

      subject_faculty[faculty_index].resource_required[faculty_resource_index].resource_count--;
      return { fac_name: subject_faculty[faculty_index].faculty_name, res_name: res_name, sub_name: subject_faculty[faculty_index].subject_name, resource_type: batch_object.resource_type };
    }

  }

  return null;
}

// assign

// const [data, setData] = useState({
//     department: {
//         id: 0,
//         department_name: "",
//     },
//     branch: {
//         id: 0,
//         branch_name: "",
//         dept_id: 0,
//     },
//     classes: {
//         id: 0,
//         class_no: 0,
//         branch_id: 0,
//         branch_name: "",
//         dept_name: "",
//     },
//     semester: {
//         id: 0,
//         sem_no: "",
//         class_id: 0,
//     },
//     subject: [
//         {
//             id: 0,
//             subject_name: "",
//             faculty_id: 0,
//             faculty_name: "",
//             resource_required: [
//                 {
//                     resource_type: "",
//                     resource_count: 0,
//                 },
//             ],
//             uni_id: 0,
//         },
//     ],
// });
