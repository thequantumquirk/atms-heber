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

  return (
    <div>
      <Dialog>
        <DialogTrigger className={`${style}`}>Update Task</DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Update Your Tasks</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div>
              <div className="my-4 mx-7">
                {status_details.map((milestone, index) => {
                  let due = FormatDate(new Date(milestone.milestoneDeadline));
                  return (
                    <div
                      key={index}
                      className="text-[1.1rem] leading-[1.5rem] my-1"
                    >
                      <input
                        type="checkbox"
                        checked={checkedMilestones[index] || false}
                        onChange={() => handleCheckboxChange(index)}
                        className="w-4 h-4 mr-2"
                      />
                      {milestone.milestoneName}
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
                        className="ml-4 border rounded px-2 py-1"
                      />
                      <p>{due}</p>
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
                className="p-2 mt-3 w-[6rem] m-auto rounded text-white font-semibold bg-[#4d47eb] hover:bg-[#635eed]  transition-all ease-linear"
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
