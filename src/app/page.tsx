"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/server/auth/auth-user";
import { fetchTasks } from "@/server/data/fetch-data";
import Dashboard from "@/components/dashboard";
import { useToast } from "@/components/ui/use-toast";
import CardsTo from "@/components/cards-to";
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/reducer';
import { setUserInfo } from "@/store/slice";
import { useDispatch } from "react-redux";
import { Tasktype } from "@/types/tasktype";
import { Button } from "@/components/ui/button";
import CardsFrom from "@/components/cards-from";
import Image from "next/image";
import Arrow from "../../public/arrowup.svg";
import Calendar from "@/components/calander";
import Filter from "../../public/filter.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [assignedTo, setAssignedTo] = useState<Tasktype[]>();
  const [assignedBy, setAssignedBy] = useState();
  const [details, setDetails] = useState({ name: "", id: "", rolePower: 0 });
  const [state, setState] = useState("To");
  const fetchUpdatedTasks = async () => {
    // Fetch updated tasks
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
            setDetails({ name: meta.name, id: id, rolePower: meta.role_power });
            //     storing into redux store for later use. comment if not needed
            dispatch(
              setUserInfo({
                name: meta.name,
                id: id,
                role_power: meta.role_power,
              })
            );
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
  if (details.rolePower == 5) {
    setState("By");
  }
  return (
    <>
      <Dashboard
        rolePower={details.rolePower}
        name={details.name}
        userId={details.id}
      />
      <div className="mx-20 mt-2 mb-5">
        {details.rolePower != 1 && details.rolePower != 5 ? (
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
          <CardsFrom assigned={assignedBy} />
        )}
      </div>
    </>
  );
}
