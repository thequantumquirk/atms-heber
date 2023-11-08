"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/server/auth/auth-user";
import { createTask, fetchTasks } from "@/server/data/fetch-data";
import Dashboard from "@/components/dashboard";
import { useToast } from "@/components/ui/use-toast"
import CardsTo from "@/components/cards-to";
import NoTask from "../../public/notask.png"
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rolePower, setRolePower] = useState(0);
  const { toast } = useToast()
  const [id, setId] = useState('')
   
  const [assignedTo, setAssignedTo] = useState();
  const [assignedBy, setAssignedBy] = useState();
  useEffect(() => {
    async function fetchSession() {
    const res = await createTask("a618b2fe-e563-4d08-9bfa-b6a0c82909b9","d3fa18fd-3e51-4bdf-9d90-e2259d696807","Complete Project","Finish the project proposal and submit it",new Date(),"MileStone 1, MileStone2, MileStone3","MileStone 1")
  console.log(res)
    const data = await getSession();
      if (!data.data) {
        router.push("/login");
      } else {
        setId(data.data?.user.id);
        let meta = data.data?.user.user_metadata;
        setName(meta.name);
        setRolePower(meta.role_power);
        const tasks = await fetchTasks(id);
         //ts-ignore
        if (tasks.data) {
            console.log(tasks.data)
            setAssignedTo(tasks.data.assignedToTasks);
            setAssignedBy(tasks.data.assignedByTasks);
        }
        else{
            toast({
                description:"Couldn't Fetch your tasks",
              })
        }
      }
    }
    fetchSession();
  }, []);

  return (
    <>
       <Dashboard rolePower={rolePower} name={name} userId={id}/>
       <div>
       {assignedTo!=undefined?
        <CardsTo assigned={assignedTo}/>
        :
        <div className="text-center">
            <Image src={NoTask} alt="NoTask" className="m-auto"></Image>
            <p className="">No Tasks Found!!</p>
        </div>
       }
       </div>
       </>
  );
}
