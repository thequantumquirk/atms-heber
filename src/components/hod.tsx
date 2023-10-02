import React, { useEffect, useState } from "react";
import { HodTo } from "@/data/assign-to";
import { Hod } from "@/data/assign-from";
import Dashboard from "./dashboard";
import FilterButton from "./filter";
import Cards from "./cards-to";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  getKeyValue,
} from "@nextui-org/react";

type Props = {};

const HOD = (props: Props) => {
  const [filter, setFilter] = useState("assigned")
  useEffect(()=>{
    console.log(filter)
  }, [filter])
  return (
    <div>
      <Dashboard />
      <div className="px-20">
        <div className="flex justify-between items-center mt-9">
          <h1 className="text-3xl font-medium">Assigned By You</h1>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="py-3 px-7">
                Filter
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              onAction={(e:React.Key) => {
                setFilter(e.toString());
              }}
            >
              <DropdownItem
                key="assigned"
              >
                Assigned
              </DropdownItem>
              <DropdownItem key="assignedTo">Assigned to</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="grid grid-cols-3 my-7 gap-4">
          {HodTo.map((assigned, key) => {
            return (
              <>
                <Cards assigned={assigned} key={key} />
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HOD;
