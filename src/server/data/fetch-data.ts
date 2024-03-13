import supabase from "../supabase";
import { parse } from "json2csv";

//------------------------------------FETCH TASKS------------------------------------
export async function fetchCompletedTasks(userId: string) {
  let { data } = await fetchTasks(userId);
  let tasks = [...data.assignedByTasks, ...data.assignedToTasks].map(
    (task) => task.id
  );
  let { data: miles, error } = await supabase
    .from("milestones")
    .select("*")
    .in("task_id", tasks);
  if (error) {
    return {
      status: false,
      data: error,
      message: "Error fetching completed milestones",
    };
  }
  if (miles) {
    const groupedTasks: any = {};
    miles.forEach((obj) => {
      if (!groupedTasks[obj.task_id]) {
        groupedTasks[obj.task_id] = [];
      }
      groupedTasks[obj.task_id].push(obj.milestone_complete);
    });
    const taskIds = [];

    for (const taskId in groupedTasks) {
      if (groupedTasks[taskId].every((value: any) => value !== null)) {
        taskIds.push(taskId);
      }
    }
    let { data: completedTasks, error } = await supabase
      .from("tasks")
      .select(
        "*, assigner_name:assigner_id(*), assignee_name:assignee_id(name)"
      )
      .in("id", taskIds);
    if (error) {
      return {
        status: false,
        data: error,
        message: "Error fetching completed tasks",
      };
    }

    return {
      status: true,
      data: completedTasks,
      message: "Fetched completed tasks",
    };
  }
}

export async function fetchTasks(userId: string) {
  let { data: assignedByTasks, error: byError } = await supabase
    .from("tasks")
    .select("*, assigner_name:assigner_id(*), assignee_name:assignee_id(name)")
    .eq("assigner_id", userId);
  if (byError) {
    return { status: false, data: byError, message: "Data Fetch Unsuccessful" };
  }

  let { data: assignedToTasks, error } = await supabase
    .from("tasks")
    .select(
      "*, assigner_name:assigner_id(name), assignee_name:assignee_id(name)"
    )
    .eq("assignee_id", userId);
  if (error) {
    return error;
  }

  let response = {
    assignedByTasks,
    assignedToTasks,
  };
  return { status: true, data: response, message: "Fetched Data Successfully" };
}

//------------------------------------CREATE TASKS------------------------------------
export async function createTask(
  assigner_id: string,
  assignee_id: string,
  task_title: string,
  task_description: string,
  task_due: Date,
  status_details: { milestone_name: string; milestone_due: Date }[],
  order: boolean,
  priority: number = 1
) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        assigner_id,
        assignee_id,
        task_title,
        task_description,
        task_due,
        order,
        priority,
      },
    ])
    .select();
  if (error) {
    return error;
  }
  let i = 1;
  for (const milestone of status_details) {
    const { data: mileStoneData, error } = await supabase
      .from("milestones")
      .insert([
        {
          task_id: data[0].id,
          milestone_name: milestone.milestone_name,
          milestone_due: milestone.milestone_due,
          milestone_order: i,
        },
      ])
      .select();
    if (error) {
      return {
        status: false,
        error,
        message: "Task creation unsuccessful",
      };
    } else {
      i += 1;
    }
  }
  return {
    status: true,
    data,
    message: "Task created successfully",
  };
}
// export async function createTask(
//   assigner_id: string,
//   assignee_id: string,
//   task_title: string,
//   task_description: string,
//   task_due: Date,
//   status_details: { milestone_name: string; milestone_due: Date }[],
//   order: boolean,
//   priority: number = 1
// ) {
//   const { data, error } = await supabase
//     .from("tasks")
//     .insert([
//       {
//         assigner_id,
//         assignee_id,
//         task_title,
//         task_description,
//         task_due,
//         order,
//         priority,
//       },
//     ])
//     .select();
//   if (error) {
//     return error;
//   }
//   let i = 1;
//   if (
//     status_details[0].milestone_name != "one milestone" &&
//     status_details[0].milestone_name != "zero milestone"
//   ) {
//     for (const milestone of status_details) {
//       const { data: mileStoneData, error } = await supabase
//         .from("milestones")
//         .insert([
//           {
//             task_id: data[0].id,
//             milestone_name: milestone.milestone_name,
//             milestone_due: milestone.milestone_due,
//             milestone_order: i,
//           },
//         ])
//         .select();
//       if (error) {
//         return {
//           status: false,
//           error,
//           message: "Task creation unsuccessful",
//         };
//       } else {
//         i += 1;
//       }
//     }
//   }
//   return {
//     status: true,
//     data,
//     message: "Task created successfully",
//   };
// }

//------------------------------------FETCH USERS------------------------------------
export async function fetchUsers(power: number, id: string) {
  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("dept")
    .eq("id", id)
    .single();

  if (userError) {
    return userError;
  }
  if (user) {
    const { dept } = user;
    let query = supabase
      .from("profiles")
      .select("*")
      .lt("power", power)
      .eq("dept", dept);
    const { data: profiles, error: profilesError } = await query;

    if (profilesError) {
      return profilesError;
    }
    return {
      status: true,
      data: profiles,
      message: "Fetched Users Successfully",
    };
  } else {
    return { error: "User not found" };
  }
}

//------------------------------------FETCH MILESTONES------------------------------------
export async function fetchMilestones(userId: string) {
  const { data, error } = await supabase
    .from("milestones")
    .select("*, tasks(assigner_id, assignee_id)")
    .or(`assigner_id.eq.${userId},assignee_id.eq.${userId}`, {
      foreignTable: "tasks",
    });
  if (error) {
    return {
      status: false,
      error,
      message: error.message,
    };
  }
  return {
    status: true,
    data,
    message: "Milestones fetched successfully",
  };
}

//------------------------------------MILESTONES FOR SINGLE TASK------------------------------------
export async function fetchMilestonesByTask(taskId: string) {
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("id", taskId);

  if (error) {
    return {
      status: false,
      error,
      message: error.message,
    };
  }
  return {
    status: true,
    data,
    message: "Milestones fetched successfully",
  };
}

//------------------------------------UPDATE TASK------------------------------------
export async function updateTask(
  update_details: {
    id: string;
    milestone_complete: Date | null;
    milestone_comment: string;
  }[]
) {
  console.log(update_details);
  for (const milestone of update_details) {
    const { error } = await supabase
      .from("milestones")
      .update({
        milestone_comment: milestone.milestone_comment,
        milestone_complete: milestone.milestone_complete,
      })
      .eq("id", milestone.id)
      .select();
    if (error) {
      return {
        status: false,
        error,
        message: error.message,
      };
    }
  }
  return {
    status: true,
    message: "Status updated successfully",
  };
}

//------------------------------------DELETE TASK------------------------------------
export async function deleteTask(taskId: string) {
  let { data, error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.log(error);
    return {
      status: false,
      error,
      message: error.message,
    };
  }
  return {
    status: true,
    data,
    message: "Task Deleted Successfully",
  };
}

//------------------------------------EXPORT------------------------------------
export async function exportTasksToCSV(id: string, option: string) {
  try {
    let query = supabase
      .from("tasks")
      .select(
        "id, task_title, task_description, task_due, status_details, assigned_date, assigner_name:assigner_id(name, id), assignee_name:assignee_id(name, id)"
      );
    switch (option) {
      case "by":
        query = query.eq("assigner_id", id);
        break;
      case "to":
        query = query.eq("assignee_id", id);
        break;
      default:
        console.log("query1");
        let query1 = supabase
          .from("tasks")
          .select(
            "id, task_title, task_description, task_due, status_details, assigned_date, assigner_name:assigner_id(name, id), assignee_name:assignee_id(name, id)"
          )
          .eq("assignee_id", id);
        const { data, error } = await query1;
        if (error) {
          return {
            status: false,
            exportError: error,
            message: error.message,
          };
        }
        const csv = parse(data);
        const blob = new Blob([csv], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = "tasks.csv";
        downloadLink.click();
        query = query.eq("assigner_id", id);
        break;
    }
    console.log("query");
    const { data, error } = await query;
    if (error) {
      return {
        status: false,
        exportError: error,
        message: error.message,
      };
    }
    const csv = parse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = "tasks.csv";
    downloadLink.click();
    return {
      status: true,
      csv,
      message: "Exported Successfully",
    };
  } catch (error) {
    return {
      status: false,
      exportError: error,
      message: "Export Failed",
    };
  }
}
