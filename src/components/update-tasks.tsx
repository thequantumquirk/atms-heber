import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { updateTask } from "@/server/data/fetch-data";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { MilestoneType } from "@/types/milestonetype";
import { FormatDate } from "@/utilities/utillities";

type Props = {
  id: string;
  status_details: MilestoneType[] | undefined;
  order: boolean;
  style: string;
  onUpdateTasks: () => void;
};

const Update = ({ id, status_details, style, order, onUpdateTasks }: Props) => {
  const { toast } = useToast();
  const [checkedMilestones, setCheckedMilestones] = useState<boolean[]>([]);
  const [milestoneComments, setMilestoneComments] = useState<string[]>([]);
  const router = useRouter();

  // Initialize checkbox states based on status_details
  useEffect(() => {
    if (status_details) {
      const initialCheckedMilestones = status_details.map(
        (milestone) => milestone.milestone_complete !== null
      );
      setCheckedMilestones(initialCheckedMilestones);

      const initialComments = status_details?.map(
        (milestone) => milestone.milestone_comment || ""
      );
      setMilestoneComments(initialComments);
    }
  }, [status_details]);
  if (status_details) {
    const handleCheckboxChange = (index: number) => {
      if (order) {
        setCheckedMilestones((prevState) => {
          const newState = [...prevState];
          newState[index] = !newState[index];

          // Ensure sequential updating
          for (let i = 0; i < index; i++) {
            if (!newState[i]) {
              // Notify the user or prevent checkbox toggle
              // You can add UX logic here
              return prevState;
            }
          }
          return newState;
        });
      } else {
        // Non-sequential updating
        setCheckedMilestones((prevState) => {
          const newState = [...prevState];
          newState[index] = !newState[index];
          return newState;
        });
      }
    };
    const handleCommentChange = (index: number, comment: string) => {
      setMilestoneComments((prevComments) => {
        const updatedComments = [...prevComments];
        updatedComments[index] = comment;
        console.log(updatedComments);
        return updatedComments;
      });
    };

    const updateTaskStatus = () => {
      let updatedStatus: {
        id: string;
        milestone_complete: Date | null;
        milestone_comment: string;
      }[] = [];
      updatedStatus = status_details.map((milestone, index) => {
        const shouldUpdate = checkedMilestones[index];

        return {
          id: milestone.id,
          milestone_complete: shouldUpdate ? new Date() : null,
          milestone_comment: milestoneComments[index] || "", // Update comments for all milestones
        };
      });

      updateTask(updatedStatus);
    };

    const calculateDaysLeft = (dueDate: Date) => {
      const currentDate = new Date();
      const dueDateObj = new Date(dueDate);
      const timeDifference = dueDateObj.getTime() - currentDate.getTime();
      const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      return daysLeft;
    };

    if (status_details.length != 1 && status_details.length != 0) {
      return (
        <Button className={`${style}`}>
          <Dialog>
            <DialogTrigger className={`${style}`}>Update Task</DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-xl text-center">
                  Update Your Tasks
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div className="h-[25rem] w-[30rem] overflow-auto">
                  <div className="my-4 px-7 flex flex-col gap-3">
                    {status_details.map((milestone, index) => {
                      let due = FormatDate(new Date(milestone.milestone_due));
                      let daysLeft = calculateDaysLeft(milestone.milestone_due);
                      let duein;
                      let dueWarningColor;
                      if (daysLeft < 0) {
                        duein = "Pending";
                      } else if (daysLeft === 0) {
                        duein = "Due Today";
                      } else {
                        duein = `Due in ${daysLeft} days`;
                      }

                      return (
                        <div key={index} className="flex w-full">
                          <div
                            className={
                              milestone.milestone_complete
                                ? "bg-green-300  px-1"
                                : "bg-rose-400  px-1"
                            }
                          ></div>
                          <div className="w-full">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem value={`${index}`}>
                                <AccordionTrigger className="w-full">
                                  <div className="px-2">
                                    {/* bg-[#3f38ff]/20  */}
                                    <div
                                      key={index}
                                      className="text-[1rem] leading-[1.5rem]"
                                    >
                                      <div className="flex gap-3 items-center mb-2">
                                        <input
                                          type="checkbox"
                                          checked={
                                            checkedMilestones[index] || false
                                          }
                                          onChange={() =>
                                            handleCheckboxChange(index)
                                          }
                                          className="w-4 h-4"
                                        />
                                        <span className="text-[1.12rem] text-black font-semibold px-2">
                                          {milestone.milestone_name}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="text-xs text-black text-left">
                                          {due} - <b>{duein}</b>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="px-2 pt-3 border-t ">
                                    <input
                                      type="text"
                                      value={milestoneComments[index]}
                                      onChange={(e) =>
                                        handleCommentChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                      placeholder={
                                        milestone.milestone_comment
                                          ? milestone.milestone_comment
                                          : "Add a comment"
                                      }
                                      className={
                                        milestone.milestone_complete
                                          ? "w-full py-2 px-2 bg-green-50"
                                          : "bg-rose-50 py-2 px-2 w-full"
                                      }
                                    />
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={() => {
                      updateTaskStatus();
                    }}
                    className="p-2 mt-3 w-[6rem] m-auto rounded text-white font-semibold bg-[#4d47eb] hover:bg-[#635eed] transition-all ease-linear"
                  >
                    Update
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => {
            updatesingleTask(id);
          }}
          //   isDisabled={status_details[0].milestone_due ? true : false}
          className="w-44 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-semibold text-sm"
        >
          {status_details[0].milestone_complete ? "Done" : "Mark as Done"}
        </Button>
      );
    }
  }
};

export default Update;
