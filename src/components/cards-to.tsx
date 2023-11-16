import { Tasktype } from "@/types/tasktype";
import React from "react";
import { FormatDate } from "@/utilities/utillities";
import NoTask from "../../public/notask.png"
import Image from "next/image";
import Update from "./update-tasks";

type Props = { assigned: Tasktype[]|undefined};
const CardsTo = (props: Props) => {
  const { assigned } = props;
  if(assigned){
    console.log(assigned)
  return (
    <>
    {assigned.length!=0?
        <div>
            {assigned.map((task, key)=>{

                const date = FormatDate(task.task_due)
                return(<div key={key} className="py-6 px-7 border-2 rounded-lg min-h-full">
          <div>
            <div className="flex flex-col ">
              <div>
                <p className="font-medium">
                  From : <span className="text-[#3e38f5]">{task.assigner_name.name}</span>
                </p>
                <p className="text-2xl font-medium">{task.task_title}</p>
              </div>
              <div>
                <p>{task.task_description}</p>
                <p className="font-medium">Due : {date}</p>
                <Update id={task.assignee_id} status_details={task.status_details} current_status={task.current_status}/>
              </div>
            </div>
          </div>
        </div>)})}
        
      </div>
        :
        <div className="text-center">
            <Image src={NoTask} alt="NoTask" className="m-auto"></Image>
            <p className="">No Tasks Found!!</p>
        </div>
       }
   </>
  );
}
else{
    return(
        <div>
            <p className="mx-auto font-semibold text-xl">Loading...</p>
        </div>
    )
}
}

export default CardsTo;
