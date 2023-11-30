"use client";
import Plus from "../../public/plus.svg";
import Image from "next/image";
import { useState } from "react";
import { createTask, fetchUsers } from "@/server/data/fetch-data";
import plus from "../../public/plus.svg";
import { useToast } from "./ui/use-toast";
import { PersonType } from "@/types/usertype";
import { Skeleton } from "@nextui-org/react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const inputtext =
  "bg-slate-100 w-full rounded-lg px-5 py-2 text-sm hover:bg-slate-200 ";
type Props = { role: number; userId: string };
export default function TaskForm({ role, userId }: Props) {
  const [selectedUser, setSelectedUser] = useState("");
  const [date, setDate] = useState<Date>();
  const handleItemChange = (value: string) => {
    setSelectedUser(value);
  };
  const { toast } = useToast();
  const [people, setpeople] = useState<PersonType[]>();
  async function fetch() {
    const data: any | null = await fetchUsers(role);
    if (data.data) {
      setpeople(data.data);
    } else {
      toast({
        description: data.message,
      });
    }
  }
  fetch();
  async function handleSubmit(event: any) {
    event.preventDefault();
    var to = String(event.target.user.value);
    var name = String(event.target.name.value);
    var desc = String(event.target.desc.value);
    var milestones = String(event.target.milestones.value);
    var due = String(event.target.due.value);
    var dueDate = new Date(due);
    const result: any | null = await createTask(
      userId,
      to,
      name,
      desc,
      dueDate,
      milestones,
      ""
    );
    toast({
      description: "Loading...",
    });
    if (result.status) {
      toast({
        description: result.message,
      });
    } else {
      toast({
        description: `${result.message}`,
      });
    }
  }
  if (people) {
    return (
      <div>
        <Dialog>
          <DialogTrigger className="py-2 rounded bg-slate-100 px-5 flex gap-2">
            <Image src={plus} alt="plus icon" className=" mt-1"></Image>
            Assign Task
          </DialogTrigger>
          <DialogContent className="bg-white">
            <>
              <DialogHeader className="flex flex-col gap-1 text-2xl font-semibold">
                <DialogTitle> Task Assignment</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit}
                className="my-3 flex flex-col gap-7 m-4"
              >
                <DialogDescription>
                  <div>
                    <p className="font-semibold text-lg pb-2">Task Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className={`justify-start ${inputtext}`}>
                            {selectedUser
                              ? `${selectedUser}`
                              : "Assign Task To"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-white">
                          <DropdownMenuLabel>
                            Select a Faculty
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={selectedUser}
                            onValueChange={handleItemChange}
                          >
                            {people.map((item, index) => (
                              <DropdownMenuRadioItem
                                key={index}
                                value={item.name}
                              >
                                {item.name}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <input
                        className={inputtext}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Task Title"
                      ></input>
                      <input
                        className={inputtext}
                        type="text"
                        name="desc"
                        id="desc"
                        placeholder="Description"
                      ></input>
                      <input
                        className={`${inputtext} h-20`}
                        type="text"
                        id="milestones"
                        placeholder="Milestones (seperated with comma)"
                      ></input>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold text-lg pb-2">
                      Deadline Details
                    </p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className={cn(
                            `justify-start text-left ${inputtext}`,
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      name="submit"
                      id="submit"
                      className=" mx-auto  hover:bg-indigo-700 bg-indigo-600 text-white py-2 mt-6 rounded px-3"
                    >
                      <p>Add Task</p>
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </>
          </DialogContent>
        </Dialog>
      </div>
    );
  } else {
    return <Skeleton className="w-32 h-10 rounded-lg" />;
  }
}
