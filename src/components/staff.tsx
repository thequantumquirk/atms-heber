import React, { useState } from "react";
import Dashboard from "./dashboard";
import { staffTo } from "@/data/assign-to";
import { staff } from "@/data/assign-from";
import CardsFrom from "./cards-from";
import CardsTo from "./cards-to";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  getKeyValue,
} from "@nextui-org/react";

type Props = {};

const Staff = (props: Props) => {
  const [filter, setFilter] = useState("assigned");
  return (
    <div>
      <Dashboard />
      <div>
        {filter == "assigned" ? (
          <div className="px-20">
            <div className="flex justify-between items-center mt-9">
              <h1 className="text-3xl font-medium">Assigned To You</h1>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="py-3 px-7">
                    Filter
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Static Actions"
                  onAction={(e: React.Key) => {
                    setFilter(e.toString());
                  }}
                >
                  <DropdownItem key="assigned">Assigned To You</DropdownItem>
                  <DropdownItem key="assignedTo">Assigned By You</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="grid grid-cols-3 my-7 gap-4">
              {staff.tasks.map((assigned, key) => {
                return (
                  <>
                    <CardsFrom assigned={assigned} key={key} />
                  </>
                );
              })}
            </div>
          </div>
        ) : (
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
                  onAction={(e: React.Key) => {
                    setFilter(e.toString());
                  }}
                >
                  <DropdownItem key="assigned">Assigned To You</DropdownItem>
                  <DropdownItem key="assignedTo">Assigned By You</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="grid grid-cols-3 my-7 gap-4">
              {staffTo.map((assigned, key) => {
                return (
                  <>
                    <CardsTo assigned={assigned} key={key} />
                  </>
                );
              })}
            </div>
          </div>
        )}{" "}
      </div>
    </div>
  );
};

export default Staff;
