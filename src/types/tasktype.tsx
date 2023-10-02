import { MilestoneType } from "./milestone-type";

export interface TaskType
{
  from: string;
  name: string;
  description: string;
  deadline: string;
  milestones: MilestoneType;
}
