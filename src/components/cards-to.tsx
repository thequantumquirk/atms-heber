import { TaskToType } from "@/types/tasktotype";
import React from "react";
import { FormatDate } from "@/utilities/utillities";

type Props = { assigned: TaskToType };
const CardsTo = (props: Props) => {
  const { assigned } = props;
  const date = new Date(assigned.task.deadline);
  const deadline = FormatDate(date);
  return (
    <div>
      <div className="py-6 px-7 border-2 rounded-lg min-h-full">
        <div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-medium">
                To : <span className="text-[#3e38f5]">{assigned.to}</span>
              </p>
              <p className="text-2xl font-medium h-14 my-3">{assigned.task.name}</p>
            </div>
            <div>
              <p>{assigned.task.description}</p>
              <p className="font-medium">Due : {deadline}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsTo;
