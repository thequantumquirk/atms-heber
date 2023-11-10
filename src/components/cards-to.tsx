import { Tasktype } from "@/types/tasktype";
import React from "react";
import { FormatDate } from "@/utilities/utillities";
import { useToast } from "@/components/ui/use-toast"
import NoTask from "../../public/notask.png"
import Image from "next/image";

type Props = { assigned: Tasktype[] };
const CardsTo = (props: Props) => {
  const { assigned } = props;
  if(assigned){
  return (
    <>
    {assigned.length!=0?
        <div>
            {assigned.map((task, key)=>{

                const date = FormatDate(task.task_due)
                return(<div key={key} className="py-6 px-7 border-2 rounded-lg min-h-full">
          <div>
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-medium">
                  From : <span className="text-[#3e38f5]">{task.assigner_id}</span>
                </p>
                <p className="text-2xl font-medium h-14 my-3">{task.task_title}</p>
              </div>
              <div>
                <p>{task.task_description}</p>
                <p className="font-medium">Due : {date}</p>
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
