import { MilestoneType } from "./milestonetype";

export interface Tasktype {
  assigned_date: Date;
  assigner_name: { name: string };
  assignee_name: { name: string };
  assignee_id: string;
  assigner_id: string;
  current_status: string;
  id: string;
  status_details: MilestoneType[];
  task_description: string;
  task_due: Date;
  task_title: string;
  order: boolean;
  priority: number;
}
