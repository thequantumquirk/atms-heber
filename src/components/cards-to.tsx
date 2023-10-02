import { TaskToType } from "@/types/tasktotype";
import React from "react";
type Props = { assigned: TaskToType };
const CardsTo = (props: Props) => {
  const { assigned } = props;
  return (
    <div>
      <div className="py-10 px-5 border-2 rounded-xl min-h-full">
        <div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-2xl">{assigned.task.name}</p>
              <p className="mt-2">
                To : <span className="text-[#3e38f5]">{assigned.to}</span>
              </p>
            </div>
            <div>
              <p>{assigned.task.description}</p>
              <p>Due: {assigned.task.deadline}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsTo;
