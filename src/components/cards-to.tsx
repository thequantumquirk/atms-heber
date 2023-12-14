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
  function calculateProgress(task: Tasktype): number {
    console.log(task.status_details);
    const milestonesDone = task.status_details.filter(
      (milestone) => milestone.milestoneDone !== null
    ).length;
    const totalMilestones = task.status_details.length;
    return Math.ceil((milestonesDone * 100) / totalMilestones);
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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {assigned.map((task, key) => {
              const date = FormatDate(task.task_due);
              const progress = calculateProgress(task);

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
                        status_details={task.status_details}
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
