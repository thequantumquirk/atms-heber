export interface MilestoneType {
  id: number;
  milestoneName: string;
  milestoneDeadline: Date;
  milestoneComment: string;
  milestoneDone: null | Date;
}
