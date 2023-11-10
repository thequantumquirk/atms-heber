"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/server/auth/auth-user";
import { createTask, fetchTasks } from "@/server/data/fetch-data";
import Dashboard from "@/components/dashboard";
import { useToast } from "@/components/ui/use-toast"
import CardsTo from "@/components/cards-to";
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/store/slice";
import { Tasktype } from "@/types/tasktype";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast()
  const dispatch = useDispatch();

  const [assignedTo, setAssignedTo] = useState<Tasktype[]>();
  const [assignedBy, setAssignedBy] = useState();

  useEffect(() => {
    async function fetchSession() {
        const data = await getSession()
      if (!data.data) {
        router.push("/login");
      } else {
        const id =data.data?.user.id;
        let meta = data.data?.user.user_metadata;
        if(id && meta){
            console.log(meta.name,id, meta.role_power)
            dispatch(
                setUserInfo({
                  name: meta.name,
                  id: id,
                  role_power: meta.role_power,
                })
              );
            }
        const tasks = await fetchTasks(id);
        console.log(tasks)
        if (tasks.data) {
            setAssignedTo(tasks.data.assignedToTasks);
            setAssignedBy(tasks.data.assignedByTasks);
        }
        else{
            toast({
                description:`${tasks.message}`,
              })
        }
      }
    }
    fetchSession();
  }, []);
  const { name, id, role_power } = useSelector((state:RootState) => state.user);
  console.log(id, name, role_power)
  console.log(assignedTo)

  return (
    <>
       <Dashboard rolePower={role_power} name={name} userId={id}/>
       <CardsTo assigned={assignedTo}/>
       </>
  );
}
