import { error } from "console";
import { genAllocator } from "./resourceAllocator";
// [
// [
//   [
//     { fac_name : "", subject_name : "", batch_no : 0, resource_type : ""}, 
//     {}, 
//     {}, 
//     {}, 
//     {}
//   ], 
//   [], 
//   [null], 
//   [], 
//   [], 
//   [null], 
//   [], 
//   []
// ], 
// [], 
// [], 
// [], 
// []
// ];

export function createTimetable(
  numOfDays: number,
  numOfSessions: number,
  unallocable_sessions: number[]
): any[] {
  let timeTable = genAllocator(["TimeTable"], numOfDays, numOfSessions)[0]
    .sessions;

  for (let i = 0; i < numOfDays; i++) {
    for (let j = 0; j < numOfSessions; j++) {
      if (unallocable_sessions.includes(j)) {
        timeTable[i][j] = ["null"];
      } else {
        timeTable[i][j] = [];
      }
    }
  }
  return timeTable;
}

export function fillTimetable(
  timeTable: any[],
  day: number,
  session: number,
  fac_name: string,
  subject_name: string,
  batch_no: number,
  resource_name: string,
  resource_type:string
) {
  if (timeTable[day][session][0] == "null") {
    throw new Error("Cannot allocate resources to this session");
  }
  timeTable[day][session].push({
    fac_name,
    subject_name,
    batch_no,
    resource_type,
    resource_name
  });
}

export function getFilteredTimeTable(timeTable: any[], filter_by: string) {
  let filteredTimeTable = timeTable.map((day) => {
    return day.map((session: any) => {
      // Loop through each slot in the session
      return session.map((slot: any) => {
        if (slot == "null") {
          return "break";
        }
        if (
          slot.fac_name == filter_by ||
          slot.subject_name == filter_by ||
          slot.batch_no == filter_by ||
          slot.resource_type == filter_by ||
          slot.resource_name == filter_by
        ) {
          return slot;
        }
        return "Free";
      });
    });
  });

  filteredTimeTable.forEach((day, dayIndex) => {
    day.forEach((session: any, sessionIndex: any) => {
      if (session.length == 0) {
        session.push("Free");
      } else if (
        session.some((item: any) => typeof item === "object" && item !== "null")
      ) {
        while (session.indexOf("Free") != -1) {
          session.splice(session.indexOf("Free"), 1);
        }
      }
      const free_count = session.filter((item: any) => item === "Free").length;
      if (free_count == session.length && session.length != 1) {
        filteredTimeTable[dayIndex][sessionIndex] = ["Free"];
      }
    });
  });
  return filteredTimeTable;
}