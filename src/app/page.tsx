"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/server/auth/auth-user";
import { fetchTasks } from "@/server/data/fetch-data";
import Dashboard from "@/components/dashboard";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rolePower, setRolePower] = useState(0);
  

  const [task, setTask] = useState({});
  useEffect(() => {
    async function fetchSession() {
      const data = await getSession();
      if (!data.data) {
        router.push("/login");
      } else {
        console.log(data.data)
        let id = data.data?.user.id;
        let meta = data.data?.user.user_metadata;
        setName(meta.name);
        setRolePower(meta.role_power);
        const tasks = await fetchTasks(id);
        if (tasks.data) {
          setTask(tasks.data);
        }
      }
    }
    fetchSession();
  }, []);

  return (
   
       <Dashboard rolePower={rolePower} name={name}/>
  );
}
