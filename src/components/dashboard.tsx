import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem, Button} from "@nextui-org/react";
import { ToLocalTime } from "./utils/utillities";
export default function Dashboard() {

  const date = new Date();
  const today = ToLocalTime(date);
  const Hour = today.getUTCHours();
  var greeting: string;

  if (Hour >= 0 && Hour < 12) {
    greeting = "Good Morning!";
  } else if (Hour > 12 && Hour < 17) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }
    return (
      <>
        <div className="px-24 py-10 flex justify-between items-center  bg-[#f7f9fa]">
          <h1 className="text-4xl">{greeting}</h1>
          <div className="flex gap-12  items-center justify-center">
            <button className="p-2 bg-[#3e38f5] rounded-lg text-white">
              Assign Task
            </button>
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
      </>
    );
}