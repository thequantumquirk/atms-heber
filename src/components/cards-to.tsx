"use client";
import { Tasktype } from "@/types/tasktype";
import { useState, useEffect } from "react";
import { FormatDate } from "@/utilities/utillities";
import NoTask from "../../public/notask.svg";
import Image from "next/image";
import Update from "./update-tasks";
import Progress from "./progress";
import { fetchTasks } from "@/server/data/fetch-data";
import { CircularProgress } from "@nextui-org/react";

type Props = { Assigned: Tasktype[] | undefined };
const CardsTo = ({ Assigned }: Props) => {
  const [assigned, setAssigned] = useState<Tasktype[] | undefined>(undefined);

  // Set the initial state when 'Assigned' prop changes
  useEffect(() => {
    if (Assigned) {
      setAssigned(Assigned);
    }
  }, [Assigned]);
  async function fetchUpdatedTasks() {
    if (assigned) {
      const data: any | null = await fetchTasks(assigned[0].assignee_id);
      if (data.data) {
        setAssigned(data.data.assignedToTasks);
      }
    }
  }
  if (assigned) {
    return (
      <>
        {assigned.length != 0 ? (
          <div className="grid grid-cols-3 gap-5 my-7">
            {assigned.map((task, key) => {
              const date = FormatDate(task.task_due);
              const status_details = task.status_details.split(",");
              const current_status = task.current_status.split(",");
              let count = current_status.length;
              if (current_status[0] == "") count = 0;
              const complete = Math.ceil((count / status_details.length) * 100);
              console.log(current_status, status_details);
              return (
                <div key={key} className="bg-[#3e38f5]/10 px-7 py-5 rounded">
                  <div>
                    <div className="flex justify-between leading-10">
                      <div className="py-1 h-14">
                        <p className="text-xl font-bold">{task.task_title}</p>
                        <p className="text-sm text-[#a7a9d2]">
                          {task.task_description}
                        </p>
                        <p>
                          Assigned By :{" "}
                          <span className="text-[#3e38f5] font-semibold">
                            {task.assigner_name.name}
                          </span>
                        </p>
                      </div>
                      <div>
                        <Progress percent={complete} />
                      </div>
                    </div>
                    <div className="grid grid-flow-col justify-stretch pt-5 w-full gap-3">
                      <div className="font-medium bg-indigo-600/10  rounded ring-1 ring-inset w-44 ring-indigo-600/50 text-center leading-10 ml-2">
                        {date}
                      </div>
                      <Update
                        onUpdateTasks={fetchUpdatedTasks}
                        style="rounded bg-[rgba(62,56,245,0.9)]  hover:bg-[hsl(242,80%,65%)] text-white font-medium w-44 py-2"
                        id={task.id}
                        status_details={task.status_details}
                        current_status={task.current_status}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <Image src={NoTask} alt="NoTask" className="mx-auto"></Image>
            <p className=" text-stone-400 text-sm -my-10 ">
              No tasks assigned for you at the moment
            </p>
          </div>
        )}
      </>
    );
  } else {
    return (
      <div className="my-14">
        <CircularProgress
          classNames={{
            svg: "w-14 h-14 drop-shadow-md",
            indicator: "stroke-indigo-600",
            track: "stroke-white/10",
          }}
          className="mx-auto"
          aria-label="Loading..."
        />
        <p className="flex justify-center text-stone-600 font-semibold text-xl my-1">
          Loading
        </p>
      </div>
    );
  }
};

export default CardsTo;
