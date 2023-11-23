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

type Props = {
  id: string;
  status_details: string;
  current_status: string;
  style: string;
  onUpdateTasks: () => void;
};

const Update = ({
  id,
  status_details,
  current_status,
  style,
  onUpdateTasks,
}: Props) => {
  const { toast } = useToast();
  const [milestoneChecked, setMilestoneChecked] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  // Parse status_details to get milestones
  const milestones: string[] = status_details.split(",");

  // Initialize checkbox states based on current_status
  useEffect(() => {
    const completedMilestones: string[] = current_status
      .split(",")
      .map((milestone) => milestone.trim());
    const initialMilestoneChecked: { [key: string]: boolean } = {};
    milestones.forEach((milestone) => {
      initialMilestoneChecked[milestone.trim()] = completedMilestones.includes(
        milestone.trim(),
      );
    });
    setMilestoneChecked(initialMilestoneChecked);
  }, [status_details, current_status]);

  const handleCheckboxChange = (milestone: string) => {
    setMilestoneChecked((prevState) => ({
      ...prevState,
      [milestone]: !prevState[milestone],
    }));
  };

  const updateTaskStatus = () => {
    const updatedMilestones: string[] = [];
    Object.entries(milestoneChecked).forEach(([milestone, isChecked]) => {
      if (isChecked) {
        updatedMilestones.push(milestone);
      }
    });
    const updatedCurrentStatus: string = updatedMilestones.join(",");

    updateTask(id, updatedCurrentStatus)
      .then((response) => {
        // Handle success response
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
            <DialogTitle className='text-xl'>Update Your Tasks</DialogTitle>
          </DialogHeader>
          <DialogDescription>
              <div>
                <div className='my-4 mx-7'>
                {milestones.map((milestone, key) => (
                  <div key={key} className='text-[1.1rem] leading-[1.5rem] my-1'>
                    <input
                      type="checkbox"
                      checked={milestoneChecked[milestone.trim()] || false}
                      onChange={() => handleCheckboxChange(milestone.trim())}
                      className='w-4 h-4 mr-2'
                    />
                    {milestone.trim()}
                  </div>
                ))}
                </div>
              </div>
            </DialogDescription>
          <DialogFooter>
          <DialogClose asChild >
                <Button onClick={updateTaskStatus} className="p-2 mt-3 w-[6rem] m-auto rounded text-white font-semibold bg-[#4d47eb] hover:bg-[#635eed]  transition-all ease-linear">Update</Button>
                </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Update;
