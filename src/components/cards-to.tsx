import { Tasktype } from "@/types/tasktype";
import React from "react";
import { FormatDate } from "@/utilities/utillities";
import { useToast } from "@/components/ui/use-toast"

type Props = { assigned: Tasktype[] };
const CardsTo = (props: Props) => {
  const { assigned } = props;
  return(
    <>
    <table>
    <tr>
                        <th>Task</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Assigned On</th>
                        <th>Milestones</th>
                    </tr>
    {assigned.map((task,key)=>{
        const due = FormatDate(task.task_due)
        const creation = FormatDate(task.assigned_date)
        return(
                    <tr  key={key}>
                        <th className="font-medium">{task.task_title}</th>
                        <th className="font-medium">{task.task_description}</th>
                        <th className="font-medium">{due}</th>
                        <th className="font-medium">{creation}</th>
                        <th className="font-medium">{task.status_details}</th>
                    </tr>
        )
    })}
    </table>
    </>
  )
//   const date = new Date(assigned.task.deadline);
//   const deadline = FormatDate(date);
//   const { toast } = useToast()
//   return (
//     <div>
//       <div className="py-6 px-7 border-2 rounded-lg min-h-full">
//         <div>
//           <div className="flex flex-col gap-4">
//             <div>
//               <p className="font-medium">
//                 To : <span className="text-[#3e38f5]">{assigned.to}</span>
//               </p>
//               <p className="text-2xl font-medium h-14 my-3">{assigned.task.name}</p>
//             </div>
//             <div>
//               <p>{assigned.task.description}</p>
//               <p className="font-medium">Due : {deadline}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
};

export default CardsTo;
