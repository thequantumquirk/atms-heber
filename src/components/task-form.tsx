"use client";
import Plus from "../../public/plus.svg";
import Image from "next/image";
import React, { Key, useState } from "react";
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
import { Avatar } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import { Check, ChevronsUpDown } from "lucide-react";
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
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
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
import { ro } from "date-fns/locale";
const inputtext =
  "bg-slate-100 w-full rounded-lg px-5 py-2 text-sm hover:bg-slate-200 ";

type Props = { role: number; userId: string; onAssign: () => void };

export default function TaskForm({ role, userId, onAssign }: Props) {
  const [filteredPeople, setfilteredPeople] = useState<PersonType[]>();
  const [open, setOpen] = React.useState(false);
  const [filtervalue, setfiltervalue] = React.useState("");
  const [inputValue, setInputValue] = useState("");
  const [filter, setfilter] = useState(false);

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
    var to = String(inputValue);
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
                                className=" bg-slate-100 w-full rounded-lg px-5 py-2 text-sm hover:bg-slate-200 justify-start"
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
                                className=" bg-slate-100 w-full rounded-lg px-5 py-2 text-sm hover:bg-slate-200 justify-start"
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
                              className="bg-slate-100 w-full rounded-lg px-5 py-2 text-sm hover:bg-slate-200 justify-start"
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
                                        setfiltervalue(currentValue);
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
                                        setfiltervalue(currentValue);
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
                                      setfiltervalue(currentValue);
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
