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

function calculateProgress(task: Tasktype): number {
  const milestonesDone = task.status_details.filter(
    (milestone) => milestone.milestoneDone !== null
  ).length;
  const totalMilestones = task.status_details.length;
  return Math.ceil((milestonesDone * 100) / totalMilestones);
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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {assigned.map((task, key) => {
              const date = FormatDate(task.task_due);
              const progress = calculateProgress(task);

              const isModalOpen = openModalIndex === key;
              return (
                <div
                  key={key}
                  className="bg-[#3e38f5]/10 px-7 py-5 w-full rounded hover:bg-[#3e38f5]/20"
                >
                  <Button
                    onPress={() => handleOpenModal(key)} // Pass 'key' here
                    className="w-full h-full p-1 bg-[#000000]/0"
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
                              <Progress percent={progress} />
                            </div>
                          </div>
                          <div className="flex flex-row justify-between pt-5 w-full gap-5">
                            <div className="px-2 bg-indigo-600/10 rounded ring-1 ring-inset w-fit ring-indigo-600/50 text-center leading-10 cursor-pointer font-medium">
                              {date}
                            </div>
                            <Button
                              className="w-44 py-2 bg-[#3e38f5] hover:bg-[#f53838] rounded text-white font-semibold"
                              onClick={() => {
                                remove(task.id);
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
                        {task.status_details.map((milestone, index) => (
                          <p key={index} className="my-1 mx-16">
                            <span
                              className={`p-2 rounded ${
                                milestone.milestoneDone != null
                                  ? "bg-green-200"
                                  : "bg-red-200"
                              }`}
                            >
                              {milestone.milestoneName}
                            </span>
                          </p>
                        ))}
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          className="rounded bg-[rgba(62,56,245,0.9)] text-white font-medium"
                          onPress={handleCloseModal}
                        >
                          Done
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
