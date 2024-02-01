"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createTask, fetchUsers } from "@/server/data/fetch-data";
import plus from "../../public/plus.svg";
import { useToast } from "./ui/use-toast";
import { PersonType } from "@/types/usertype";
import { Skeleton } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Switch } from "@nextui-org/react";
import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { MilestoneType } from "@/types/milestonetype";
import { FormatDate } from "@/utilities/utillities";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
type Milestone = {
  name: string;
  deadline: string;
};
const inputtext =
  "bg-slate-100 w-full rounded-lg px-5 py-2 text-sm hover:bg-slate-200 ";

type Props = { role: number; userId: string; onAssign: () => void };

export default function TaskForm({ role, userId, onAssign }: Props) {
  const [filteredPeople, setfilteredPeople] = useState<PersonType[]>();
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filter, setfilter] = useState(false);
  const [date, setDate] = useState<Date>();
  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: "", deadline: "" },
  ]);
  const [priority, setPriority] = useState<number>(1);

  const generateMilestones = (object: Milestone[]): MilestoneType[] => {
    const milestones = object.map((task, index) => ({
      id: index + 1, // Increases for each task
      milestoneDone: null, // Always null
      milestoneName: task.name, // Name of each task in input
      milestoneComment: "", // Always empty string
      milestoneDeadline: new Date(task.deadline), // Input date
    }));
    return milestones;
  };

  const addMilestone = () => {
    const lastMilestone = milestones[milestones.length - 1];
    if (lastMilestone.name !== "" && lastMilestone.deadline !== "") {
      setMilestones([...milestones, { name: "", deadline: "" }]);
    } else {
      toast({ description: "Add previous milestone first" });
    }
  };
  const handleMilestoneChange = (
    index: number,
    key: keyof Milestone,
    value: string
  ) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index][key] = value;
    setMilestones(updatedMilestones);
  };
  useEffect(() => {
    // Update 'date' state with the largest deadline from milestones
    if (milestones.length > 0) {
      const largestDeadline = milestones.reduce((maxDate, milestone) => {
        const currentDeadline = new Date(milestone.deadline);
        return currentDeadline > maxDate ? currentDeadline : maxDate;
      }, new Date(0));
      setDate(largestDeadline);
    }
  }, [milestones]);

  const handlePriority = (value: string) => {
    setPriority(parseInt(value));
  };

  const { toast } = useToast();
  function clear() {
    setMilestones([{ name: "", deadline: "" }]);
    setfilter(false);
    setDate(new Date(0));
    setInputValue("");
    setOrder(false);
    setOpen(false);
  }
  async function handleSubmit(event: any) {
    event.preventDefault();
    var to = String(inputValue);
    var name = String(event.target.name.value);
    var desc = String(event.target.desc.value);
    const status_details = generateMilestones(milestones);
    console.log("Submitted with milestones:", status_details);
    var dueDate;
    if (date) {
      var due = String(date);
      dueDate = new Date(due);
      const result: any | null = await createTask(
        userId,
        to,
        name,
        desc,
        dueDate,
        status_details,
        order,
        priority
      );
      toast({
        description: "Loading...",
      });
      if (result.status) {
        toast({
          description: result.message,
        });
        onAssign(); //refresh
        clear();
      } else {
        toast({
          description: `${result.message}`,
        });
      }
    }
  }

  useEffect(() => {
    async function fetchAssignees() {
      if (role != 0) {
        const data: any | null = await fetchUsers(role);
        if (data.data) {
          setfilteredPeople(data.data);
        } else {
          toast({
            description: data.message,
          });
        }
      }
    }
    fetchAssignees();
  }, [role]);

  if (filteredPeople) {
    const students = filteredPeople.filter((person) => person.power === 1);
    const hods = filteredPeople.filter((person) => person.power === 3);
    const facultys = filteredPeople.filter((person) => person.power === 3);

    return (
      <div>
        <Dialog>
          <DialogTrigger className="py-2 rounded bg-stone-200 px-5 flex gap-2 EaseFadeIn">
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
                className="flex flex-col gap-7 m-4 text-black"
              >
                <DialogDescription>
                  <div>
                    <p className="font-semibold text-lg pb-2 ">Task Details</p>
                    {/* assignee search starts here */}
                    <Switch
                      size="sm"
                      color="success"
                      isSelected={filter}
                      onValueChange={setfilter}
                      className={
                        filter
                          ? "my-2 text-sm text-black font-semibold"
                          : `my-2 text-sm text-stone-400`
                      }
                    >
                      Search by {role == 5 ? "Department" : "Roll Number"}
                    </Switch>
                    <div className="grid grid-cols-2 gap-3">
                      {filter ? (
                        role == 5 ? (
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                aria-expanded={open}
                                className=" bg-slate-100 w-full rounded-lg px-5 py-2 text-sm hover:bg-slate-200 justify-start text-black"
                              >
                                {inputValue
                                  ? filteredPeople.find(
                                      (person) =>
                                        person.id.toLowerCase() ==
                                        inputValue.toLowerCase()
                                    )?.name
                                  : "Select Assignee"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[13rem] p-0 bg-white">
                              <Command>
                                <CommandInput placeholder="Search User" />
                                <CommandEmpty>No User found</CommandEmpty>
                                <CommandGroup heading="Head of Departments">
                                  {hods.map((hod) => (
                                    <CommandItem
                                      key={hod.id}
                                      value={hod.dept}
                                      onSelect={(currentValue: string) => {
                                        console.log(currentValue);
                                        setInputValue(hod.id);
                                        setOpen(false);
                                      }}
                                      className="hover:bg-stone-500 pointer-events-auto COMMAND cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          inputValue === hod.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {hod.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Professors">
                                  {facultys.map((student) => (
                                    <CommandItem
                                      key={student.id}
                                      value={student.dept}
                                      onSelect={(currentValue: string) => {
                                        console.log(currentValue);

                                        setInputValue(student.id);
                                        setOpen(false);
                                      }}
                                      className="hover:bg-stone-500 pointer-events-auto COMMAND cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          inputValue === student.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {student.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Students">
                                  {students.map((student) => (
                                    <CommandItem
                                      key={student.id}
                                      value={student.dept}
                                      onSelect={(currentValue: string) => {
                                        console.log(currentValue);

                                        setInputValue(student.id);
                                        setOpen(false);
                                      }}
                                      className="hover:bg-stone-500 pointer-events-auto COMMAND cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          inputValue === student.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {student.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                aria-expanded={open}
                                className=" bg-slate-100 w-full rounded-lg px-5 py-2 text-sm hover:bg-slate-200 justify-start text-black"
                              >
                                {inputValue
                                  ? filteredPeople.find(
                                      (person) =>
                                        person.id.toLowerCase() ==
                                        inputValue.toLowerCase()
                                    )?.name
                                  : "Select Assignee"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[13rem] p-0 bg-white">
                              <Command>
                                <CommandInput placeholder="Search User" />
                                <CommandEmpty>No User found</CommandEmpty>
                                <CommandGroup heading="Professors">
                                  {facultys.map((professor) => (
                                    <CommandItem
                                      key={professor.id}
                                      value={professor.dept}
                                      onSelect={(currentValue: string) => {
                                        console.log(currentValue);
                                        setInputValue(professor.id);
                                        setOpen(false);
                                      }}
                                      className="hover:bg-stone-500 pointer-events-auto COMMAND cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          inputValue === professor.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {professor.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup>
                                  {students.map((student) => (
                                    <CommandItem
                                      key={student.id}
                                      value={
                                        student.roll_no ? student.roll_no : ""
                                      }
                                      onSelect={(currentValue: string) => {
                                        console.log(currentValue);

                                        setInputValue(student.id);
                                        setOpen(false);
                                      }}
                                      className="hover:bg-stone-500 pointer-events-auto COMMAND cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          inputValue === student.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {student.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )
                      ) : (
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              aria-expanded={open}
                              className="bg-slate-100 w-full rounded-lg px-5 py-2 text-sm hover:bg-slate-200 justify-start text-black"
                            >
                              {inputValue
                                ? filteredPeople.find(
                                    (person) =>
                                      person.id.toLowerCase() ==
                                      inputValue.toLowerCase()
                                  )?.name
                                : "Select Assignee"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[13rem] p-0 bg-white">
                            <Command>
                              <CommandInput placeholder="Search User" />
                              <CommandEmpty>No User found</CommandEmpty>
                              {hods.length != 0 ? (
                                <CommandGroup heading="Head of Departments">
                                  {hods.map((hod) => (
                                    <CommandItem
                                      key={hod.id}
                                      value={hod.name}
                                      onSelect={(currentValue: string) => {
                                        setInputValue(hod.id);
                                        setOpen(false);
                                      }}
                                      className="hover:bg-stone-500 pointer-events-auto COMMAND cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          inputValue === hod.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {hod.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              ) : (
                                <div></div>
                              )}
                              {facultys.length != 0 ? (
                                <CommandGroup heading="Professors">
                                  {facultys.map((professor) => (
                                    <CommandItem
                                      key={professor.id}
                                      value={professor.name}
                                      onSelect={(currentValue: string) => {
                                        setInputValue(professor.id);
                                        setOpen(false);
                                      }}
                                      className="hover:bg-stone-500 pointer-events-auto COMMAND cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          inputValue === professor.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {professor.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              ) : (
                                <div></div>
                              )}
                              <CommandSeparator />
                              <CommandGroup heading="Students">
                                {students.map((student) => (
                                  <CommandItem
                                    key={student.id}
                                    value={student.name}
                                    onSelect={(currentValue: string) => {
                                      setInputValue(student.id);
                                      setOpen(false);
                                    }}
                                    className="hover:bg-stone-500 pointer-events-auto COMMAND cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        inputValue === student.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {student.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                      {/* assignee search ends here */}
                      <input
                        className={inputtext}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Task Title"
                        required
                      ></input>
                      <input
                        className={inputtext + " col-span-2"}
                        type="text"
                        name="desc"
                        id="desc"
                        placeholder="Description"
                        required
                      ></input>
                      <Select onValueChange={handlePriority} defaultValue="1">
                        <SelectTrigger className={`col-span-2 ${inputtext}`}>
                          <SelectValue placeholder="Select Task Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Task Priority</SelectLabel>
                            <SelectItem value="1">Low</SelectItem>
                            <SelectItem value="2">Medium</SelectItem>
                            <SelectItem value="3">High</SelectItem>
                            <SelectItem value="4">Very High</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold text-lg pb-2">
                      Milestone Details
                    </p>

                    <div
                      className={`grid ${
                        milestones.length === 1 ? "grid-cols-1" : "grid-cols-2"
                      } ${
                        milestones.length > 2 ? "h-[11rem]" : "h-[5.5rem]"
                      } gap-3 h-[11rem] w-auto overflow-auto`}
                    >
                      {milestones.map((milestone, index) => (
                        <div key={index} className="flex flex-col gap-1">
                          <input
                            required
                            type="text"
                            value={milestone.name}
                            className={inputtext}
                            onChange={(e) =>
                              handleMilestoneChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Milestone Name"
                          />
                          <input
                            required
                            type="date"
                            value={milestone.deadline}
                            className={inputtext}
                            min={format(new Date(), "yyyy-MM-dd")}
                            onChange={(e) =>
                              handleMilestoneChange(
                                index,
                                "deadline",
                                e.target.value
                              )
                            }
                            placeholder="Milestone Deadline"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between ">
                      <Switch
                        size="sm"
                        color="success"
                        isSelected={order}
                        onValueChange={setOrder}
                        className={
                          order
                            ? "my-2 text-sm text-black font-semibold"
                            : `my-2 text-sm text-stone-400`
                        }
                      >
                        Enforce Completion Order
                      </Switch>
                      <button
                        type="button"
                        onClick={addMilestone}
                        className=" hover:bg-indigo-700 bg-indigo-600 text-white py-2 rounded px-3 font-semibold"
                      >
                        Add Milestone
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p
                      className={
                        date
                          ? FormatDate(date) == "1 Jan, 1970"
                            ? "text-center text-red-400"
                            : "text-center text-black font-semibold"
                          : ""
                      }
                    >
                      This Task&apos;s Deadline will be set to{" "}
                      {date ? (
                        FormatDate(date) == "1 Jan, 1970" ? (
                          "The Last Milestone's Deadline"
                        ) : (
                          <b>{FormatDate(date)}</b>
                        )
                      ) : (
                        "No Date Selected"
                      )}{" "}
                    </p>
                  </div>
                </DialogDescription>
                <DialogFooter className="grid grid-cols-2 justify-stretch">
                  <Button
                    onClick={() => {
                      clear();
                    }}
                    className=" hover:bg-stone-300 bg-stone-200 text-black py-2 mt-6 rounded px-3"
                  >
                    Clear Form
                  </Button>
                  <Button
                    type="submit"
                    name="submit"
                    id="submit"
                    className=" hover:bg-indigo-700 bg-indigo-600 text-white py-2 mt-6 rounded px-3 font-semibold"
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
