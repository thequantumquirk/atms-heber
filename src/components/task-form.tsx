"use client";
import Plus from "../../public/plus.svg";
import Image from "next/image";
import { Key, useState } from "react";
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
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const inputtext =
  "bg-slate-100 w-full rounded-lg px-5 py-2 text-sm hover:bg-slate-200 ";

type Props = { role: number; userId: string; onAssign: () => void };

export default function TaskForm({ role, userId, onAssign }: Props) {
  const [filteredPeople, setfilteredPeople] = useState<PersonType[]>();
  const [inputValue, setInputValue] = useState("");
  //   const [filter, setfilter] = useState(false);
  //   const [selectedKey, setSelectedKey] = useState(null);
  //   const router = useRouter();
  const [selectedUser, setSelectedUser] = useState("");

  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  async function fetch() {
    const data: any | null = await fetchUsers(role);
    if (data.data) {
      setfilteredPeople(data.data);
    } else {
      toast({
        description: data.message,
      });
    }
  }
  fetch();
  async function handleSubmit(event: any) {
    event.preventDefault();
    var to = String(selectedUser);
    var name = String(event.target.name.value);
    var desc = String(event.target.desc.value);
    var milestones = String(event.target.milestones.value);
    var due = String(date);
    var dueDate;
    if (date) {
      var due = String(date);
      dueDate = new Date(due);
      console.log(userId, to, name, desc, dueDate, milestones);
      const result: any | null = await createTask(
        userId,
        to,
        name,
        desc,
        dueDate,
        milestones,
        ""
      );
      console.log(result);
      toast({
        description: "Loading...",
      });
      if (result.status) {
        toast({
          description: result.message,
        });
        onAssign();
      } else {
        toast({
          description: `${result.message}`,
        });
      }
    }
  }
  if (filteredPeople) {
    const students = filteredPeople.filter(
      (person) => person.role == "Student"
    );
    const hods = filteredPeople.filter((person) => person.role == "HOD");
    const facultys = filteredPeople.filter(
      (person) => person.role == "Faculty"
    );
    const onSelectionChange = (id) => {
      setSelectedUser(id);
    };

    // const filterPeople = (value: string, inputValue: string) => {
    //   console.log("Value:", value);
    //   console.log("People:", filteredPeople);
    //   console.log(filter);
    //   if (inputValue.length === 0) {
    //     return true;
    //   }
    //   if (filter) {
    //     if (role === 5) {
    //       const filter = filteredPeople.filter((person) =>
    //         person.dept.toLowerCase().includes(value.toLowerCase())
    //       );
    //       return filter.length > 0; // Return true if there are filtered people, false otherwise
    //     } else {
    //       console.log("Students:", students);
    //       const filter = students.filter((student) =>
    //         student.roll_no?.includes(value)
    //       );
    //       return filter.length > 0; // Return true if there are filtered students, false otherwise
    //     }
    //   } else {
    //     const filter = filteredPeople.filter((person) =>
    //       person.name.toLowerCase().includes(value.toLowerCase())
    //     );
    //     return filter.length > 0; // Return true if there are filtered people, false otherwise
    //   }
    // };
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
                      <Autocomplete
                        placeholder="Enter Assignee Name"
                        value={inputValue}
                        onSelectionChange={onSelectionChange}
                        inputProps={{
                          classNames: {
                            input: "ml-1 ",
                            inputWrapper: `${inputtext}`,
                          },
                        }}
                      >
                        {filteredPeople.map((person) => (
                          <AutocompleteItem key={person.id}>
                            {person.name}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
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
                      <PopoverContent className="w-auto p-0 bg-white ">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className="bg-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </DialogDescription>
                <DialogFooter>
                  <Button
                    type="submit"
                    name="submit"
                    id="submit"
                    className=" mx-auto  hover:bg-indigo-700 bg-indigo-600 text-white py-2 mt-6 rounded px-3"
                  >
                    <p>Add Task</p>
                  </Button>
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
