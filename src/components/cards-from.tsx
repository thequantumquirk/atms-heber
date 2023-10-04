import { TaskType } from "@/types/tasktype";
import React from "react";
import Update from "./update-tasks";
import { FormatDate } from "@/utilities/utillities";
type Props = { assigned: TaskType };
const CardsFrom = (props: Props) => {
  const { assigned } = props;
    const date = new Date(assigned.deadline);
    const deadline = FormatDate(date);
  return (
    <div>
      <div className="py-6 px-7 border-2 rounded-lg min-h-full">
        <div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-medium">
                From : <span className="text-[#3e38f5]">{assigned.from}</span>
              </p>
              <p className="text-2xl font-medium h-14 my-3">{assigned.name}</p>
            </div>
            <div>
              <p>{assigned.description}</p>
              <p>Due: {deadline}</p>
            </div>
            <Update milestones={assigned} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsFrom;
