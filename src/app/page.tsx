"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/server/auth/auth-user";
import { fetchMilestones, fetchTasks } from "@/server/data/fetch-data";
import Dashboard from "@/components/dashboard";
import { useToast } from "@/components/ui/use-toast";
import CardsTo from "@/components/cards-to";
import { setUserInfo } from "@/store/slice";
import { useDispatch } from "react-redux";
import { Tasktype } from "@/types/tasktype";
import { Button } from "@/components/ui/button";
import CardsFrom from "@/components/cards-from";
import Image from "next/image";
import Arrow from "../../public/arrowup.svg";
import Calendar from "@/components/calander";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Completed from "@/components/completed";
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/reducer';
// import Filter from "../../public/filter.svg";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MilestoneType } from "@/types/milestonetype";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [assignedTo, setAssignedTo] = useState<Tasktype[]>();
  const [assignedBy, setAssignedBy] = useState();
  const [details, setDetails] = useState({
    name: "",
    id: "",
    rolePower: 0,
    dept: "",
  });
  const [state, setState] = useState("To");
  const [isOpen, setIsOpen] = useState(true);
  const [currentMilestones, setCurrentMilestones] = useState<MilestoneType[]>(
    []
  );
  const fetchUpdatedTasks = async () => {
    const updatedTasks: any = await fetchTasks(details.id);
    if (updatedTasks.data) {
      setAssignedTo(updatedTasks.data.assignedToTasks);
      setAssignedBy(updatedTasks.data.assignedByTasks);
    } else {
      toast({ description: `${updatedTasks.message}` });
    }
  };

  useEffect(
    () => {
      async function fetchSession() {
        const data = await getSession();
        if (!data.data) {
          //redirecting to login if no session recorded
          router.push("/login");
          toast({ description: data.error });
        } else {
          let id = data.data?.user.id;
          let meta = data.data?.user.user_metadata;
          if (id && meta) {
            //storing into local variables for refreshing purpose
            setDetails({
              name: meta.name,
              id: id,
              rolePower: meta.role_power,
              dept: meta.dept,
            });
            if (meta.role_power == 5) {
              setState("By");
            }
            //     storing into redux store for later use. comment if not needed
            // dispatch(
            //   setUserInfo({
            //     name: meta.name,
            //     id: id,
            //     role_power: meta.role_power,
            //   })
            // );
          }
          const milestones = await fetchMilestones(id);
          if (milestones.status && milestones.data) {
            console.log(milestones.data);
            setCurrentMilestones(milestones.data);
          } else {
            toast({ description: milestones.message });
          }
          //fetching all the tasks regarding that userId and storing in variables
          const tasks: any | null = await fetchTasks(id);
          if (tasks.data) {
            setAssignedTo(tasks.data.assignedToTasks);
            setAssignedBy(tasks.data.assignedByTasks);
          } else {
            toast({ description: `${tasks.message}` });
          }
        }
      }

      fetchSession();

      router.refresh();
    },
    [] //rendering once
  );
  return (
    <>
      <Dashboard
        rolePower={details.rolePower}
        name={details.name}
        userId={details.id}
        dept={details.dept}
        onassign={fetchUpdatedTasks}
      />

      <Tabs className="flex justify-center my-2">
        {details.rolePower != 5 ? (
          <Tab key="To" title="Assigned To You">
            <CardsTo Assigned={assignedTo} milestones={currentMilestones} />
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-slate-100 rounded-full px-3 py-6 fixed bottom-20 right-20 hover:bg-stone-200">
                  <Image src={Arrow} alt="arrow" width={25} />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white" side="bottom">
                <SheetHeader>
                  <SheetTitle className="mx-5">
                    Upcoming Task Due Dates
                  </SheetTitle>
                  <SheetDescription>
                    <Calendar tasks={assignedTo} />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </Tab>
        ) : null}
        {details.rolePower != 1 ? (
          <Tab key="By" title="Assigned By You">
            <CardsFrom Assigned={assignedBy} onDelete={fetchUpdatedTasks} />
          </Tab>
        ) : null}
        <Tab key="done" title="Completed">
          <Completed />
        </Tab>
      </Tabs>

      <Dialog open={currentMilestones.length > 0 && isOpen}>
        <DialogContent className="w-[40vw] flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle>Tasks for Today</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            {currentMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="p-4 rounded-lg bg-[#3e38f5]/10"
              >
                <div>Milestone Name: {milestone.milestone_name}</div>
              </div>
            ))}
          </div>
          <div>
            <Button onClick={() => setIsOpen(false)} variant={"destructive"}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* {details.rolePower != 1 && details.rolePower != 5 ? (
          <div className="flex justify-end ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded bg-slate-100">
                  <Image
                    src={Filter}
                    width={15}
                    className="mr-2"
                    alt="filterIcon"
                  ></Image>
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={state} onValueChange={setState}>
                  <DropdownMenuRadioItem value="To">
                    Assigned To You
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="By">
                    Assigned By You
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div></div>
        )}
        {state == "To" ? (
          <div>
            <CardsTo Assigned={assignedTo} />
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-slate-100 rounded-full px-3 py-6 fixed bottom-20 right-20">
                  <Image src={Arrow} alt="arrow" width={25} />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white" side="bottom">
                <SheetHeader>
                  <SheetTitle className="mx-5">
                    Upcoming Task Due Dates
                  </SheetTitle>
                  <SheetDescription>
                    <Calendar tasks={assignedTo} />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <CardsFrom Assigned={assignedBy} onDelete={fetchUpdatedTasks} />
        )} */}
    </>
  );
}
