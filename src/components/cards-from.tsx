import { useState } from "react";
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

import { Murecho } from "next/font/google";
import { MilestoneType } from "@/types/milestonetype";

type Props = {
  Assigned: Tasktype[] | undefined;
  onDelete: () => void;
  milestones: MilestoneType[];
};

const CardsFrom = ({ Assigned, onDelete, milestones }: Props) => {
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
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const today: Date = new Date();
  const { toast } = useToast();
  async function remove(taskId: string) {
    const res = await deleteTask(taskId);
    toast({
      description: res.message,
    });
    onDelete();
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
          <div className="mt-8 mx-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {assigned.map((task, key) => {
              const date = FormatDate(task.task_due);
              const progress = calculateProgress(task.id);
              const status_details = milestones?.filter(
                (status) => status.task_id == task.id
              );
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
                          <div className="flex flex-row  pt-5 w-full gap-4">
                            <div className="px-1 pt-2 pb-1 w-[50%] bg-indigo-600/10 rounded text-center cursor-pointer font-medium">
                              {date}
                            </div>
                            <Button
                              className="w-[50%] py-1 bg-indigo-600  hover:bg-[#f53838] rounded text-white font-semibold"
                              onClick={() => {
                                remove(task.id);
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
                    size="2xl"
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                  >
                    <ModalContent>
                      <ModalHeader className="flex flex-col gap-1 text-xl text-center">
                        Task Completion
                      </ModalHeader>
                      <ModalBody>
                        <table>
                          <tr className="text-lg bg-[#7f76ff1c]">
                            {/* <th className="py-4">Status</th> */}
                            <th className="py-3 pl-3 text-left border border-x-1 border-[#7f76ff1c]">
                              Milestone
                            </th>
                            <th className="h-3 pl-2  text-left border border-x-1 border-[#7f76ff1c]">
                              Completion
                            </th>
                            <th className="h-3 pl-2  text-left border border-x-1 border-[#7f76ff1c]">
                              Comment
                            </th>
                          </tr>
                          {status_details.map((milestone, index) => {
                            let done: Date = new Date(
                              milestone.milestone_complete
                                ? milestone.milestone_complete
                                : ""
                            );
                            let date = FormatDate(done);
                            let due = new Date(milestone.milestone_due);

                            const color = milestone.milestone_complete
                              ? due > done
                                ? "bg-green-400"
                                : "bg-yellow-400"
                              : "bg-red-400";
                            return (
                              <tr key={index} className="">
                                {/* <th className="text-center pl-6"><div className={`w-5 h-5 ${color} rounded`}></div></th> */}
                                <th className=" border border-x-1 border-[#7f76ff1c] font-medium text-left w-full flex gap-3 items-center ">
                                  <div
                                    className={`-py-1 w-1 h-9 ${color}`}
                                  ></div>
                                  <p>{milestone.milestone_name}</p>
                                </th>
                                <th className="border border-x-1 border-[#7f76ff1c] font-medium text-left pl-2 ">
                                  {milestone.milestone_complete
                                    ? date
                                    : "Pending"}
                                </th>
                                <th className=" border border-x-1 border-[#7f76ff1c]  font-medium text-left pl-2 ">
                                  {milestone.milestone_comment
                                    ? milestone.milestone_comment
                                    : "No Comments"}
                                </th>
                              </tr>
                            );
                          })}
                        </table>
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
            <Image
              src={NoTask}
              alt="NoTask"
              className="mx-auto"
              priority
            ></Image>
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
