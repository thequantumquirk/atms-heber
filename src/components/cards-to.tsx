"use client";
import { Tasktype } from "@/types/tasktype";
import { useState, useEffect } from "react";
import { FormatDate, getPriority } from "@/utilities/utillities";
import NoTask from "../../public/notask.svg";
import Image from "next/image";
import Update from "./update-tasks";
import Progress from "./progress";
import { fetchTasks } from "@/server/data/fetch-data";
import { CircularProgress } from "@nextui-org/react";
import { MilestoneType } from "@/types/milestonetype";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  Assigned: Tasktype[] | undefined;
  milestones: MilestoneType[];
};
const CardsTo = ({ Assigned, milestones }: Props) => {
  const [assigned, setAssigned] = useState<Tasktype[] | undefined>(undefined);

  function calculateProgress(task_id: string) {
    const status_details = milestones.filter(
      (status) => status.task_id == task_id
    );
    let completed = status_details.filter(
      (status) => status.milestone_complete
    );
    let percent;
    if (status_details.length != 0) {
      percent = (completed?.length * 100) / status_details.length;
    } else if ((status_details.length = 0)) {
      percent = 0; //CASE TO BE SOLVED YET
    } else {
      percent = 100;
    }
    return percent;
  }
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
          <div className="mt-8 mx-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {assigned.map((task, key) => {
              const date = FormatDate(task.task_due);
              console.log(task.id);
              const progress = calculateProgress(task.id);
              const status_details = milestones?.filter(
                (status) => status.task_id == task.id
              );
              // console.log(current_status, status_details);
              return (
                <div
                  key={key}
                  className="bg-[#3e38f5]/10 px-7 py-5 w-full rounded box-border"
                >
                  <div>
                    <div className="w-full flex justify-between">
                      <div className="py-1 h-14 text-left">
                        <p className="text-xl font-bold">{task.task_title}</p>

                        {/* CASE TO HANDLE WHEN THERE IS ONLY ONE MILESTONE
                        <p className="text-sm text-[#a7a9d2]">
                          {task.status_details.length == 1
                            ? task.task_description +
                              " - " +
                              task.status_details[0].milestoneName
                            : task.task_description}
                        </p> */}
                        <p>
                          Assigned By :{" "}
                          <span className="text-[#3e38f5] font-semibold">
                            {task.assigner_name.name}
                          </span>
                        </p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <p className="text-sm text-[#a7a9d2] my-2">
                                {/* Priority: <span>{getPriority(task.priority)}</span> */}
                                {task.task_description.slice(0, 40)}...
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              {task.task_description}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div>
                        <Progress percent={progress} />
                      </div>
                    </div>
                    <div className="flex flex-row justify-between pt-5 w-full gap-4">
                      <div className="px-1 pb-1 pt-1.5 w-full bg-indigo-600/10 rounded ring-1 ring-inset ring-indigo-600/50 text-center cursor-pointer font-medium">
                        {date}
                      </div>
                      <Update
                        onUpdateTasks={fetchUpdatedTasks}
                        style="w-44 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-semibold text-sm"
                        id={task.id}
                        status_details={status_details}
                        order={task.order}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <Image
              src={NoTask}
              alt="NoTask"
              className="mx-auto"
              priority
            ></Image>
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
