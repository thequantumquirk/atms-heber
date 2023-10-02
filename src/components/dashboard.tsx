import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownItem, Button} from "@nextui-org/react";
import { ToLocalTime } from "../utilities/utillities";
import TaskForm from "./task-form";
import {users} from "../data/assign-from"
export default function Dashboard() {

  const date = new Date();
  const today = ToLocalTime(date);
  const Hour = today.getUTCHours();
  const mail = useSelector((state: RootState) => state.auth.email);
  const user = users.find((user)=>user.email==mail)
  var greeting: string;

  if (Hour >= 0 && Hour < 12) {
    greeting = "Good Morning";
  } else if (Hour > 12 && Hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
    return (
      <>{mail =="cs215114102@bhc.edu.in" ?
        <div className="px-20 py-10 flex justify-between items-center  bg-[#f0f0f0]">
          <h1 className="text-4xl">{greeting} <span className="text-[#3e38f5]">{mail}</span>!</h1>
          <div className="flex gap-12  items-center justify-center">
            <TaskForm/>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="py-4 px-7">
                  Filter
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="assinged">Assigned</DropdownItem>
                <DropdownItem key="assigned-to">Assigned to</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        :
        <div className="px-20 py-8 font-medium bg-[#f0f0f0]">
                        <h1 className="text-4xl font-medium">{greeting}!</h1>
            <p className="text-[#9594b0] py-1"> Here is your Tasks <span className="text-[#3e38f5]">{user!=undefined ? user.name : ""}</span></p>
        </div>
}
      </>
    );
}
