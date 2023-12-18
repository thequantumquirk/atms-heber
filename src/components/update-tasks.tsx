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
import { useToast } from "@/components/ui/use-toast";
import { updateTask } from "@/server/data/fetch-data";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { MilestoneType } from "@/types/milestonetype";
import { FormatDate } from "@/utilities/utillities";

type Props = {
  id: string;
  status_details: MilestoneType[];
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
    const initialCheckedMilestones = status_details.map(
      (milestone) => milestone.milestoneDone !== null
    );
    setCheckedMilestones(initialCheckedMilestones);

    const initialComments = status_details.map(
      (milestone) => milestone.milestoneComment || ""
    );
    setMilestoneComments(initialComments);
  }, [status_details]);

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
    let updatedStatus: MilestoneType[] = [];

    updatedStatus = status_details.map((milestone, index) => {
      const shouldUpdate = checkedMilestones[index];

      return {
        ...milestone,
        milestoneDone: shouldUpdate ? new Date() : null,
        milestoneComment: milestoneComments[index] || "", // Update comments for all milestones
      };
    });

    updateTask(id, updatedStatus)
      .then((response) => {
        if (response.status) {
          toast({
            description: response.message,
          });
          onUpdateTasks();
        } else {
          toast({
            description: "Unable to Update Task. Try again.",
          });
        }
      })
      .catch((error) => {
        toast({
          description: error.message,
        });
      });
  };

  const calculateDaysLeft = (dueDate) => {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    const timeDifference = dueDateObj.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysLeft;

  }

  return (
    <div>
      <Dialog>
        <DialogTrigger className={`${style}`}>Update Task</DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              Update Your Tasks
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="h-[30rem] overflow-auto">
              <div className="my-4 mx-7 flex flex-col gap-3">
                {status_details.map((milestone, index) => {
                  let due = FormatDate(new Date(milestone.milestoneDeadline));
                  let daysLeft = calculateDaysLeft(milestone.milestoneDeadline);
                  let dueOn;
                  let dueWarningColor;
                  if(daysLeft < 0){
                    dueOn = "Pending";
                    dueWarningColor = "red";
                  } else if(daysLeft === 0){
                    dueOn = "Due Today";
                    dueWarningColor = "red";
                  } else{
                    dueOn = `Due in ${daysLeft} days`;
                    dueWarningColor = "green";
                  }
                  return (
                    <div>
                      <div className=" w-full bg-[#3f38ff]/20 border border-b-0 border-indigo-600/50  py-2 rounded-t flex justify-between">
                        <p className="px-3  text-black font-bold">
                          {due}
                        </p>
                        <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full bg-${dueWarningColor}-500`}></div>
                        <p className="px-3 italic">{dueOn}</p>
                        </div>
                      </div>
                      <div className="border border-t-0 border-indigo-600/50 p-3 rounded-b bg-[#3f38ff]/10">
                        {/* bg-[#3f38ff]/20  */}
                        <div
                          key={index}
                          className="text-[1rem] leading-[1.5rem] my-2"
                        >
                          <div className="flex gap-3 items-center mb-2">
                            <input
                              type="checkbox"
                              checked={checkedMilestones[index] || false}
                              onChange={() => handleCheckboxChange(index)}
                              className="w-5 h-5"
                            />
                            <span className="text-[1.15rem] text-black font-semibold">
                              {milestone.milestoneName}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={milestoneComments[index]}
                            onChange={(e) =>
                              handleCommentChange(index, e.target.value)
                            }
                            placeholder={
                              milestone.milestoneComment
                                ? milestone.milestoneComment
                                : "Add a comment"
                            }
                            className="ring-1 ring-inset ring-indigo-600/50 rounded px-2 py-1 mt-2   w-full"
                          />
                        </div>
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
                onClick={updateTaskStatus}
                className="p-2 mt-3 w-[6rem] m-auto rounded text-white font-semibold bg-[#4d47eb] hover:bg-[#635eed] transition-all ease-linear"
              >
                Update
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Update;
