import { Button, Skeleton } from "@nextui-org/react";
import TaskForm from "@/components/task-form";
import Image from "next/image";
import exportIcon from "../../public/export.svg";
import { ToLocalTime } from "@/utilities/utillities";
import { signOut } from "@/server/auth/auth-user";
import { useToast } from "@/components/ui/use-toast";
import { exportTasksToCSV } from "@/server/data/fetch-data";

type Props = {
  rolePower: number;
  name: string;
  userId: string;
  dept: string;
  onassign: () => void;
};

const Dashboard = ({ rolePower, name, userId, dept, onassign }: Props) => {
  const date = new Date();
  const today = ToLocalTime(date);
  const Hour = today.getUTCHours();
  let greeting: string;
  const { toast } = useToast();

  if (Hour >= 0 && Hour < 12) {
    greeting = "Good Morning";
  } else if (Hour > 12 && Hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  async function signUserOut() {
    const { data, error, message, status } = await signOut();
    if (status) {
      window.location.href = "/";
    } else {
      toast({
        description: error,
      });
    }
  }
  async function exportData() {
    const { status, message } = await exportTasksToCSV(userId, "all");
    if (status) {
      toast({ description: "Export Successful" });
    } else {
      toast({ description: `Export Failed: ${message}` });
    }
  }

  return (
    <>
      <div className="px-20 py-8 flex flex-col xl:flex-row gap-6 justify-between items-center bg-stone-100">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl xl:text-4xl font-semibold flex gap-2">
            {greeting}
            {name ? (
              <span className="text-[rgba(62,56,245)] EaseFadeIn"> {name}</span>
            ) : (
              <span>
                <Skeleton className="h-12 w-40 rounded-lg" />
              </span>
            )}
          </h1>
          <p className="text-lg xl:text-xl">Here is a list of your tasks</p>
        </div>
        <div className="flex gap-2 items-center justify-center">
          {rolePower != 1 && (
            <div className="flex gap-2 items-center">
              <TaskForm
                role={rolePower}
                userId={userId}
                dept={dept}
                onAssign={onassign}
              />
              <Button
                className="rounded bg-stone-200 EaseFadeIn"
                onClick={() => {
                  exportData();
                }}
              >
                <Image src={exportIcon} width={20} alt="Plus"></Image>
                Export
              </Button>
            </div>
          )}
          <Button
            className=" hover:bg-indigo-500 bg-indigo-600 text-white font-semibold px-5 py-2 rounded"
            onClick={() => signUserOut()}
          >
            Sign-out
          </Button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
