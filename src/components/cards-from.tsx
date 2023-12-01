import React, { useState } from "react";
import { Tasktype } from "@/types/tasktype";
import { FormatDate } from "@/utilities/utillities";
import Progress from "./progress";
import NoTask from "../../public/notask.svg";
import Image from "next/image";
import { deleteTask, fetchTasks } from "@/server/data/fetch-data";
import { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { useToast } from "./ui/use-toast";
function stripMilestones(status_details: string, current_status: string) {
  const completedMilestones: string[] = current_status
    .split(",")
    .map((milestone) => milestone.trim());
  return completedMilestones;
}

type Props = { Assigned: Tasktype[] | undefined; onDelete: () => void };

const CardsFrom = ({ Assigned, onDelete }: Props) => {
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
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);

  const { toast } = useToast();
  async function remove(taskId: string) {
    const res = await deleteTask(taskId);
    toast({
      description: res.message,
    });
  }
  if (assigned) {
    const handleOpenModal = (index: number) => {
      setOpenModalIndex(index);
    };

    const handleCloseModal = () => {
      setOpenModalIndex(null);
    };

    return (
      <>
        {assigned.length != 0 ? (
          <div className="grid grid-cols-3 gap-5 my-7">
            {assigned.map((task, key) => {
              const date = FormatDate(task.task_due);
              const completedMilestones = stripMilestones(
                task.status_details,
                task.current_status
              );
              const milestones: string[] = task.status_details.split(",");
              let complete = 0;
              if (task.current_status.length !== 0) {
                complete = Math.ceil(
                  (completedMilestones.length * 100) / milestones.length
                );
              }

              const isModalOpen = openModalIndex === key;
              return (
                <div
                  key={key}
                  className="bg-[#3e38f5]/10 py-5 rounded hover:bg-[#3e38f5]/20"
                >
                  <Button
                    onPress={() => handleOpenModal(key)} // Pass 'key' here
                    className="w-full h-full bg-[#000000]/0"
                  >
                    <div className="w-full">
                      {
                        <div className="w-full">
                          <div className=" w-full flex justify-between leading-10">
                            <div className="py-1 h-14 text-left">
                              <p className="text-xl font-bold">
                                {task.task_title}
                              </p>
                              <p className="text-sm text-[#a7a9d2]">
                                {task.task_description}
                              </p>
                              <p>
                                Assigned To :{" "}
                                <span className="text-[#3e38f5] font-semibold">
                                  {task.assignee_name.name}
                                </span>
                              </p>
                            </div>
                            <div>
                              <Progress percent={complete} />
                            </div>
                          </div>
                          <div className="grid grid-flow-col justify-stretch pt-5 w-full gap-5">
                            <div className="font-medium bg-indigo-600/10 py-1 px-3 rounded ring-1 ring-inset ring-indigo-600/50 text-center pt-2.5">
                              {date}
                            </div>
                            <Button
                              className="bg-indigo-500 hover:bg-red-500 py-1 px-3 rounded text-white text-center font-semibold"
                              onClick={() => {
                                deleteTask(task.id);
                                onDelete();
                              }}
                            >
                              Delete Task
                            </Button>
                          </div>
                        </div>
                      }
                    </div>
                  </Button>
                  <Modal
                    size="xl"
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                  >
                    <ModalContent>
                      <ModalHeader className="flex flex-col gap-1 text-xl">
                        Task Completion
                      </ModalHeader>
                      <ModalBody>
                        {milestones.map((milestone, index) => (
                          <p key={index} className="my-1 mx-16">
                            <span
                              className={`p-2 rounded ${
                                completedMilestones.includes(milestone.trim())
                                  ? "bg-green-200"
                                  : "bg-red-200"
                              }`}
                            >
                              {milestone.trim()}
                            </span>
                          </p>
                        ))}
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          className="rounded bg-[rgba(62,56,245,0.9)] text-white font-medium"
                          onPress={handleCloseModal}
                        >
                          Close
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <Image src={NoTask} alt="NoTask" className="mx-auto"></Image>
            <p className=" text-stone-400 text-sm -my-10 ">
              No one to Monitor at the moment
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

export default CardsFrom;
