import React from "react";
import Dashboard from "./dashboard";
import { staffTo } from "@/data/assign-to";
import { staff } from "@/data/assign-from";
import Cards from "./cards-to";
import FilterButton from "./filter";

type Props = {};

const Staff = (props: Props) => {
  return (
    <>
      <Dashboard />
      <div className="px-20">
        <div className="flex justify-between items-center mt-9">
          <h1 className="text-3xl font-medium">Assigned By You</h1>
          <FilterButton></FilterButton>
        </div>
        <div className="grid grid-cols-3 my-7 gap-4">
          {staffTo.map((assigned, key) => {
            return (
              <>
                <Cards assigned={assigned} key={key} />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Staff;
