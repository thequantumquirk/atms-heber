import { TaskType } from "@/types/tasktype";
import React from "react";
type Props = { assigned: TaskType };
const CardsFrom = (props: Props) => {
  const { assigned } = props;
  return (
    <div>
      <div className="py-10 px-5 border-2 rounded-xl min-h-full">
        <div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-2xl">{assigned.name}</p>
              <p className="mt-2">
                To : <span className="text-[#3e38f5]">{assigned.from}</span>
              </p>
            </div>
            <div>
              <p>{assigned.description}</p>
              <p>Due: {assigned.deadline}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsFrom;
