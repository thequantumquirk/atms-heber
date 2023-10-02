import React, { useState } from 'react'
import Dashboard from './dashboard'
import { principalTo } from '@/data/assign-to'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  getKeyValue,
} from "@nextui-org/react";
import CardsTo from './cards-to';

type Props = {}

const Principal = (props: Props) => {
  const [filter, setFilter] = useState("assigned");
  console.log(filter);
  return (
    <>
    <Dashboard />
    <div className="px-20">
        <div className="flex justify-between items-center mt-9">
          <h1 className="text-3xl font-medium">Assigned By You</h1>
        </div>
      <div className="grid grid-cols-3 my-7 gap-4">
        {principalTo.map((assigned, key) => {
          return (
            <>
              <CardsTo assigned={assigned} key={key} />
            </>
          );
        })}
      </div>
      </div>
    </>
  );

}
export default Principal