export interface MilestoneType {
  id: string;
  task_id: string;
  milestone_name: string;
  milestone_due: Date;
  milestone_comment: string;
  milestone_complete: null | Date;
  milestone_order: number;
}
