'use client'
import Plus from "../../public/plus.svg"
import Image from 'next/image'
import { useEffect, useState } from "react"
import { usePathname } from 'next/navigation'
import { dashboardFliter } from "@/data/assign-to"
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownItem} from "@nextui-org/react";   
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button, CircularProgress } from "@nextui-org/react";
import { Filter } from "@/types/filter"
import plus from "../../public/plus.svg"


const inputtext = "bg-slate-100 w-full rounded-lg px-5 py-2 text-sm "
export default function TaskForm() {
    const pathname = usePathname()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleOpen = () => {
        onOpen();
    }
    const [role, setRole] = useState('')
    const [people, setpeople] = useState<Filter[]>([])
    useEffect(()=>{
        const filteredPeople = dashboardFliter.filter((people)=>people.role==role)

        setpeople(filteredPeople)
    }, [role])
    async function handleSubmit(event: any) {
        event.preventDefault()
        const details = {
            to: String(event.target.user.value),
            name: String(event.target.name.value),
            desc: String(event.target.desc.value),
            milestones: String(event.target.milestones.value),
            deadlineDate: String(event.target.deadlineDate.value),
            deadlineTime: String(event.target.deadlineTime.value)
        }
        console.log(details)
        // const res = await fetch(`${pathname}/api`, {
        //     method: "PUT",
        //     headers: {
        //         "Content-type": "application/json"
        //     },
        //     body: JSON.stringify(details)
        // })
        // if (res.ok) {
        //     alert("Taskie Added Successfully");
        // }
        // else {
        //     alert("Failed to add Taskie");
        // }
    }
    return (
      <div>
        <Button
          onPress={() => handleOpen()}
          className="py-2 rounded-lg bg-slate-100 px-4"
        >
          <Image src={plus} alt="plus icon"></Image>
          Assign Task
        </Button>
        <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-xl">
                  Task Assignment
                </ModalHeader>
                <form
                  onSubmit={handleSubmit}
                  className="my-10 flex flex-col gap-7 m-5"
                >
                  <ModalBody>
                    <div>
                      <p className="font-semibold text-lg pb-2">Task Details</p>
                      <div className="grid grid-cols-2 gap-3">
                        <select className={inputtext}>
                          <option>HOD</option>
                          <option>Staff</option>
                          <option>Student</option>
                        </select>

                        <select className={inputtext}>
                          <option selected className="text-left">
                            Assignee
                          </option>
                          {people.map((person, key) => {
                            return (
                              <option key={key} value={person.name}>
                                {person.name}
                              </option>
                            );
                          })}
                        </select>
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
                    <div>
                      <p className="font-semibold text-lg pb-2">
                        Deadline Details
                      </p>
                      <div className="flex gap-5">
                        <input
                          type="date"
                          className={inputtext}
                          id="deadlineDate"
                          name="deadlineDate"
                        ></input>
                        <input
                          type="time"
                          className={inputtext}
                          id="deadlineTime"
                          name="deadlineTime"
                        ></input>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <button
                      type="submit"
                      name="submit"
                      id="submit"
                      className=" mx-auto bg-slate-100 rounded-lg flex w-[8.8rem] h-10 py-2 px-5 gap-2 my-2"
                    >
                      <Image
                        src={Plus}
                        width={16}
                        alt="Plus"
                        className="mt-0.5"
                      ></Image>
                      <p>Add Task</p>
                    </button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
}
