import { MilestoneType } from "./milestone-type"
export interface TaskType {
    to : string,
    role : string,
    task:{
        name: string,
        description: string,
        deadline:string,
        milestones : MilestoneType
    }

}