import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownItem, Button} from "@nextui-org/react";
import { ToLocalTime } from "../utilities/utillities";
import TaskForm from "./task-form";

import exportIcon from "../../public/export.svg"
import Image from "next/image";
import { ProfileType } from "@/types/profiletype";

type Props = { user: ProfileType };

const Dashboard = ({user}: Props) => {
console.log(user,"DASHBOARD")
  const date = new Date();
  const today = ToLocalTime(date);
  const Hour = today.getUTCHours();
  var greeting: string;

  if (Hour >= 0 && Hour < 12) {
    greeting = "Good Morning";
  } else if (Hour > 12 && Hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

    return (
      <>
        {user.role_power==1 ? 
          <div className="px-20 py-7 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-semibold">
                {greeting}
                <span className="text-[rgba(62,56,245)]">{" "}{user.name}</span>!
              </h1>
              <p className="text-xl  text-slate-500 mt-1">
                Here is a list of your tasks 
              </p>
            </div>
            <div className="flex gap-12  items-center justify-center">
              <Button className="rounded-lg bg-[rgba(62,56,245,0.9)] text-white font-medium">
                Sign-out
              </Button>
            </div>
          </div>
         : 
          <div className="px-20 py-7 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-semibold">
                {greeting}<span className="text-[rgba(63,56,245)]">{" "}{user.name}</span>!
              </h1>
              <p className="text-xl text-slate-500 mt-1">
                Here is a list of your tasks
              </p>
            </div>
            <div className="flex gap-12  items-center justify-center">
              <TaskForm />
              <Button className="rounded-lg bg-slate-100">
                <Image src={exportIcon} width={20} alt="Plus"></Image>
                Export
              </Button>
              <Button className="rounded-lg bg-[rgba(62,56,245,0.9)] text-white font-medium">
                Sign-out
              </Button>
            </div>
          </div>
        }
      </>
    );
    }
    export default Dashboard
