import { MilestoneType } from "./milestone-type"
export interface TaskToType {
    mail: string,
    to : string,
    role : string,
    task:{
        name: string,
        description: string,
        deadline:string,
        milestones : MilestoneType
    }

}