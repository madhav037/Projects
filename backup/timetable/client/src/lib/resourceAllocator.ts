import redis, { connectRedis, disconnectRedis } from "./redis";

export function genAllocator(
  resource: string[],
  numOfdays: number,
  numOfSessions: number
): any[] {
  let allocator: any[] = [];
  resource.forEach((res) => {
    let sessions = [];
    for (let i = 0; i < numOfdays; i++) {
      sessions.push(Array(numOfSessions).fill(0));
    }
    allocator.push({ name: res, sessions: sessions });
  });
  return allocator;
}

export function fillAllocator(
  allocator: any[],
  name: string,
  day: number,
  session: number,
  capacity: number,
  addStudents: number
) {
  for (let i = 0; i < allocator.length; i++) {
    if (allocator[i].name == name) {
      // console.log(allocator[i].name);
      // console.table(allocator[i].sessions[day][session]);
      // console.log(typeof(addStudents));
      // console.log(capacity);

      allocator[i].sessions[day][session] += addStudents / capacity;

      // console.log(allocator[i].name);
      // console.table(allocator[i].sessions[day][session]);

      if (allocator[i].sessions[day][session] > 1) {
        console.error("Capacity full! cannot add students");
        allocator[i].sessions[day][session] = 1;
        throw new Error("Capacity full! cannot add students");
      }
      break;
    }
  }
}

export async function generateAllocators(
  uniId: number,
  numOfDays: number,
  numOfSessions: number,
  facuilty?: boolean
) {
  try {
    await redis.connect();
    const response = await fetch(
      `http://localhost:3000/api/university/${uniId}/resource`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch resources: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const resources = data.data;

    for (const resource of resources) {
      try {
        const key = await addResourceTypeToRedis(uniId, resource.resource_type);

        const res_exists = await redis.lRange(key, 0, -1);
        let exists = false;

        for (const item of res_exists) {
          const parsedItem = JSON.parse(item);
          if (parsedItem[resource.resource_name]) {
            console.log(
              `Resource ${resource.faculty_name} already exists. Skipping...`
            );
            exists = true;
            break;
          }
        }

        if (exists) {
          continue;
        }
        let allocator = genAllocator(
          [resource.resource_name],
          numOfDays,
          numOfSessions
        );
        const res = { [resource.resource_name]: allocator };

        await redis.rPush(key, JSON.stringify(res));
      } catch (innerError) {
        console.error(
          `Error processing resource ${resource.resource_name}:`,
          innerError
        );
      }
    }

    if (facuilty) {
      const fac_res = await fetch(
        `http://localhost:3000/api/university/${uniId}/faculty`,
        {
          method: "GET",
        }
      );

      if (!fac_res.ok) {
        throw new Error(
          `Failed to fetch faculty: ${fac_res.status} ${fac_res.statusText}`
        );
      }

      const fac_data = await fac_res.json();
      const faculties = fac_data.data;

      for (const faculty of faculties) {
        try {
          const fac_key = await addResourceTypeToRedis(uniId, "Faculty");

          const fac_exists = await redis.lRange(fac_key, 0, -1);
          let exists = false;

          for (const item of fac_exists) {
            const parsedItem = JSON.parse(item);
            if (parsedItem[faculty.faculty_name]) {
              console.log(
                `Resource ${faculty.faculty_name} already exists. Skipping...`
              );
              exists = true;
              break;
            }
          }

          if (exists) {
            continue;
          }
          let fac_allocator = genAllocator(
            [faculty.faculty_name],
            numOfDays,
            numOfSessions
          );
          const fac_res = { [faculty.faculty_name]: fac_allocator };

          await redis.rPush(fac_key, JSON.stringify(fac_res));
        } catch (innerError) {
          console.error(
            `Error processing resource ${faculty.faculty_name}:`,
            innerError
          );
        }
      }
    }
  } catch (error) {
    console.error("Error fetching resources:", error);
  } finally {
    if (redis.isOpen) {
      await redis.disconnect();
    }
  }
}

export async function getAllocator(
  uniId: number,
  resourceType: string,
  resourceName?: string
): Promise<any> {
  console.log("reached");
  try {
    await connectRedis();
    const key = `${uniId}:${resourceType}`;
    const exists = await redis.exists(key);
    if (!exists) {
      throw new Error(`Resource type ${resourceType} not found`);
    }
    const allocators = await redis.lRange(key, 0, -1);
    if (resourceName) {
      for (const allocator of allocators) {
        const data = JSON.parse(allocator);
        if (data[resourceName]) {
          return data[resourceName];
        }
      }
      throw new Error(`Resource ${resourceName} not found`);
    } else {
      return allocators.map((allocator) => JSON.parse(allocator));
    }
  } catch (error) {
    console.error("Error fetching allocator:", error);
  } finally {
    disconnectRedis();
  }
}

export async function updateAllocator({
  uniId,
  resourceType,
  resourceName,
  session,
  day,
  capacity,
  addStudents,
  faculty,
}: {
  uniId: number;
  resourceType: string;
  resourceName: string;
  session?: number;
  day?: number;
  capacity?: number;
  addStudents?: number;
  faculty?: boolean;
}) {
  try {
    await redis.connect();
    const key = `${uniId}:${resourceType}`;

    const exists = await redis.exists(key);
    if (!exists) {
      throw new Error(`Resource type ${resourceType} not found`);
    }

    const allocators = await redis.lRange(key, 0, -1);

    for (let i = 0; i < allocators.length; i++) {
      const data = JSON.parse(allocators[i]);

      if (data[resourceName]) {
        if (faculty) {
          updateFacultyAllocator(data, resourceName, day, session);
        } else {
          updateGeneralAllocator(
            data,
            resourceName,
            day,
            session,
            capacity,
            addStudents
          );
        }

        allocators[i] = JSON.stringify(data);
        await redis.lSet(key, i, allocators[i]);
        break;
      }
    }
  } catch (error) {
    console.error("Error updating allocator:", error);
  } finally {
    if (redis.isOpen) {
      await redis.disconnect();
    }
  }
}

function updateFacultyAllocator(
  data: any,
  resourceName: string,
  day?: number,
  session?: number
) {
  if (day === undefined || session === undefined) {
    throw new Error("Missing required fields for faculty allocator");
  }

  console.log("faculty", data[resourceName]);
  data[resourceName][0].sessions[day][session] = 1;
  console.log("Updated faculty allocator", data[resourceName]);
}

function updateGeneralAllocator(
  data: any,
  resourceName: string,
  day?: number,
  session?: number,
  capacity?: number,
  addStudents?: number
) {
  if (
    day === undefined ||
    session === undefined ||
    capacity === undefined ||
    addStudents === undefined
  ) {
    throw new Error("Missing required fields for general allocator");
  }

  fillAllocator(
    data[resourceName],
    resourceName,
    day,
    session,
    capacity,
    addStudents
  );
  console.log("Updated general allocator", data[resourceName][0]);
}

export async function updateAllAllocators({
  uniId,
  resourceType,
  resourceAllocator,
}: {
  uniId: number;
  resourceType: string;
  resourceAllocator: any[];
}) {
  await connectRedis();
  const key = `${uniId}:${resourceType}`;
  const exists = await redis.exists(key);

  if (!exists) {
    throw new Error(`Resource type ${resourceType} not found`);
  }

  const allocators = await redis.lRange(key, 0, -1);

  for (let i = 0; i < allocators.length; i++) {
    const data = JSON.parse(allocators[i]);
    const resourceName = Object.keys(data)[0];
    const updatedResource = resourceAllocator.find(
      (resource) => resource.name === resourceName
    );

    if (updatedResource) {
      const updatedAllocator = updatedResource.sessions;
      data[resourceName][0].sessions = updatedAllocator;
      allocators[i] = JSON.stringify(data);
      await redis.lSet(key, i, allocators[i]);
    }
  }
}

export async function deleteAllocator(
  uniId: number,
  resourceType: string,
  resourceName: string
) {
  try {
    await redis.connect();
    const key = `${uniId}:${resourceType}`;

    const exists = await redis.exists(key);
    if (!exists) {
      throw new Error(`Resource type ${resourceType} not found`);
    }

    const allocators = await redis.lRange(key, 0, -1);

    for (let i = 0; i < allocators.length; i++) {
      const data = JSON.parse(allocators[i]);

      if (data[resourceName]) {
        allocators.splice(i, 1);
        await redis.lSet(key, i, JSON.stringify(data));
        break;
      }
    }
  } catch (error) {
    console.error("Error deleting allocator:", error);
  } finally {
    if (redis.isOpen) {
      await redis.disconnect();
    }
  }
}

export async function deleteAllAllocators(uniId: number, resourceType: string) {
  try {
    await connectRedis();
    const key = `${uniId}:${resourceType}`;

    const exists = await redis.exists(key);
    if (!exists) {
      throw new Error(`Resource type ${resourceType} not found`);
    }

    await redis.del(key);
  } catch (error) {
    console.error("Error deleting all allocators:", error);
  } finally {
    await disconnectRedis();
  }
}

async function addResourceTypeToRedis(
  uniID: number,
  resourceType: string
): Promise<string> {
  const key = `${uniID}:${resourceType}`;
  const exists = await redis.exists(key);
  if (!exists) {
    await redis.rPush(key, JSON.stringify([]));
  }
  return key;
}
