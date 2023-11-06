"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSession, signOut } from "@/server/auth/auth-user";
import { createTask, fetchTasks, fetchUsers } from "@/server/data/fetch-data";
import Dashboard from "@/components/dashboard";
import { ProfileType } from "@/types/profiletype";

export default function Home() {
    const router = useRouter();
    const id = useRef('')
    const [user,setUser] = useState({id:'', name:'', role:'',role_power:0})
    const [task, setTask]= useState({})
    useEffect(()=>{
        async function fetchSession(){
    //      const result = createTask('a618b2fe-e563-4d08-9bfa-b6a0c82909b9', 'd636502c-8daf-412f-9aa0-718256f7c366', "Hybernetix Fees", "Collect the fees fir symposium and submit it", new Date(),"MileStone 1, MileStone2, MileStone3", "Milestone3");
    //      console.log(result)
            const data = await getSession()
            if(data.data==null){
                router.push('/login')
            }
            else{
                id.current = data.data?.user.id
                console.log(id.current)
                const tasks = await fetchTasks(id.current);
                const res = await fetchUsers()
                if(tasks.data) {
                    setTask(tasks.data)
                }
                const users = res.data as ProfileType[]
                if(users!=null) var User = users.find(user=>user.id==userId)
                console.log(users)
                if(User!=undefined) setUser(User)
            }
        }
        fetchSession()
    },[])

    
    let userId = id.current as unknown as string

  console.log(user,"PAGE")
  console.log(task)
    
    return (
        <div>
            <Dashboard user={user}/>

        </div>
  
    )
}
