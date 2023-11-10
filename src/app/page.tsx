"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/server/auth/auth-user";
import { fetchTasks } from "@/server/data/fetch-data";
import Dashboard from "@/components/dashboard";
import { useToast } from "@/components/ui/use-toast"
import CardsTo from "@/components/cards-to";
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import { setUserInfo } from "@/store/slice";
import { useDispatch } from "react-redux";
import { Tasktype } from "@/types/tasktype";

export default function Home() {
    const router = useRouter();
    const { toast } = useToast()
    const dispatch = useDispatch();
    const [assignedTo, setAssignedTo] = useState<Tasktype[]>();
    const [assignedBy, setAssignedBy] = useState();
    const [details, setDetails] = useState({name:"", id:"", rolePower:0})
  useEffect(() => {
    async function fetchSession() {
        const data = await getSession()
        if (!data.data) {
            //redirecting to login if no session recorded
            router.push("/login");
            toast({description:data.error})
        } 
        else {
            let id =data.data?.user.id;
            let meta = data.data?.user.user_metadata;
            if(id && meta){
                //storing into local variables for refreshing purpose
                setDetails({name:meta.name,id:id,rolePower:meta.role_power })
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
            const tasks:any|null = await fetchTasks(id);
            if (tasks.data) {
                setAssignedTo(tasks.data.assignedToTasks);
                setAssignedBy(tasks.data.assignedByTasks);
            }
            else{
                toast({description:`${tasks.message}`})
        }
      }
    }
    fetchSession();
  }, []//rendering once
  );
  return (
    <>
       <Dashboard rolePower={details.rolePower} name={details.name} userId={details.id}/>
       <CardsTo assigned={assignedTo}/>
       </>
  );
}
