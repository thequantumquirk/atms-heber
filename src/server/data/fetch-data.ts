import supabase from "../supabase";

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
  status_details: string,
  current_status: string
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
      },
    ])
    .select();

  if (error) {
    return error;
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

export async function updateTask(id: string, current_status: string) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ current_status: current_status })
    .eq("id", id)
    .select();
  if (error) {
    return {
      status: false,
      error,
      message: "Status update Unsuccessful",
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
      message: "Couldn't Delete Task",
    };
  }
  return {
    status: true,
    data,
    message: "Task Deleted Successfully",
  };
}
