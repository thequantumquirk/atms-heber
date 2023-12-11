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
  onassign: () => void;
};

const Dashboard = ({ rolePower, name, userId, onassign }: Props) => {
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
      // If export is successful, show a success message or perform any necessary actions
      toast({ description: "Export Successful" });
    } else {
      // If export fails, show an error message or handle the failure appropriately
      toast({ description: `Export Failed: ${message}` });
    }
  }

  return (
    <>
      {rolePower === 1 ? (
        <div className="px-20 pt-10 pb-12 flex flex-col xl:flex-row gap-6 justify-between items-center ">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl  xl:text-4xl font-semibold flex gap-2">
              {greeting}
              {name ? (
                <span className="text-[rgba(62,56,245)]"> {name}</span>
              ) : (
                <Skeleton className="h-3 w-3/5 rounded-lg" />
              )}
              !
            </h1>
            <p className="text-xl  text-slate-500 mt-1">
              Here is a list of your tasks
            </p>
          </div>
          <div className="flex gap-12  items-center justify-center">
            <Button
              className=" hover:bg-indigo-600 bg-indigo-500 text-white font-semibold px-5 py-2 mt-6 rounded"
              onClick={() => signUserOut()}
            >
              Sign-out
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-20 pt-10 pb-20 flex flex-col xl:flex-row gap-6 justify-between items-center bg-stone-100">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl xl:text-4xl font-semibold flex gap-2">
              {greeting}
              {name ? (
                <span className="text-[rgba(62,56,245)]"> {name}</span>
              ) : (
                <span>
                  <Skeleton className="h-12 w-40 rounded-lg" />
                </span>
              )}
              !
            </h1>
            <p className="text-lg xl:text-xl text-slate-500 mt-1">
              Here is a list of your tasks
            </p>
          </div>
          {/* {name ? ( */}
          <div className="flex gap-12  items-center justify-center">
            <TaskForm role={rolePower} userId={userId} onAssign={onassign} />
            <Button
              className="rounded bg-stone-200"
              onClick={() => {
                exportData();
              }}
            >
              <Image src={exportIcon} width={20} alt="Plus"></Image>
              Export
            </Button>
            <Button
              className=" hover:bg-indigo-600 bg-indigo-500 text-white font-semibold px-5 py-2 rounded"
              onClick={() => signUserOut()}
            >
              Sign-out
            </Button>
          </div>
          {/* ) : null} */}
        </div>
      )}
    </>
  );
};

export default Dashboard;
