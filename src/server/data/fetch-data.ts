import { MilestoneType } from "@/types/milestonetype";
import supabase from "../supabase";
import { parse } from "json2csv";

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

export async function createTask(
  assigner_id: string,
  assignee_id: string,
  task_title: string,
  task_description: string,
  task_due: Date,
  status_details: MilestoneType[],
  current_status: string,
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
        status_details,
        current_status,
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
          milestone_name: milestone.milestoneName,
          milestone_due: milestone.milestoneDeadline,
          milestone_comment: milestone.milestoneComment,
          milestone_complete: milestone.milestoneDone,
          milestone_order: i,
        },
      ])
      .select();
    if (error) {
      return error;
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

export async function fetchUsers(rolePower: number) {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .lt("role_power", rolePower);
  if (error) {
    return error;
  }

  return {
    status: true,
    data: profiles,
    message: "Fetched Users Successfully",
  };
}

export async function updateTask(id: string, current_status: MilestoneType[]) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status_details: current_status })
    .eq("id", id)
    .select();
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
    message: "Status updated successfully",
  };
}

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
        // Convert data to CSV
        const csv = parse(data);
        // Create a Blob containing the CSV data
        const blob = new Blob([csv], { type: "text/csv" });

        // Create a download link
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = "tasks.csv";

        // Simulate a click on the download link to trigger the download
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
    // Convert data to CSV
    const csv = parse(data);
    // Create a Blob containing the CSV data
    const blob = new Blob([csv], { type: "text/csv" });

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = "tasks.csv";

    // Simulate a click on the download link to trigger the download
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
