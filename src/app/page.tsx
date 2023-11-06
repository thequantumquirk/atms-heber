"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession, signOut } from "@/server/auth/auth-user";
import { fetchTasks, fetchUsers } from "@/server/data/fetch-data";
import { ProfileType } from "@/types/profiletype";
import { ToLocalTime } from "@/utilities/utillities";
import { Button, Skeleton } from "@nextui-org/react";
import TaskForm from "@/components/task-form";
import Image from "next/image";
import exportIcon from "../../public/export.svg";

export default function Home() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rolePower, setRolePower] = useState(0);
  const date = new Date();
  const today = ToLocalTime(date);
  const Hour = today.getUTCHours();
  var greeting: string;

  if (Hour >= 0 && Hour < 12) {
    greeting = "Good Morning";
  } else if (Hour > 12 && Hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const [task, setTask] = useState({});
  useEffect(() => {
    async function fetchSession() {
      //      const result = createTask('a618b2fe-e563-4d08-9bfa-b6a0c82909b9', 'd636502c-8daf-412f-9aa0-718256f7c366', "Hybernetix Fees", "Collect the fees fir symposium and submit it", new Date(),"MileStone 1, MileStone2, MileStone3", "Milestone3");
      //      console.log(result)
      const data = await getSession();
      if (data.data == null) {
        router.push("/login");
      } else {
        let id = data.data?.user.id;
        console.log(id);
        const tasks = await fetchTasks(id);
        const res = await fetchUsers();
        if (tasks.data) {
          setTask(tasks.data);
        }
        const users = res.data as ProfileType[];
        if (users) {
          let User = users.find((user) => user.id === id);
          if (User) {
            setName(User.name);
            setId(User.id);
            setRole(User.role);
            setRolePower(User.role_power);
          }
        }
      }
    }
    fetchSession();
  }, [name]);

  async function signUserOut() {
    console.log("signing out user");
    const { data, error, message, status } = await signOut();
    if (status) {
      router.push("/");
    } else {
      console.error(error);
    }
  }

  return (
    <>
      {rolePower === 1 ? (
        <div className="px-20 py-7 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-semibold">
              {greeting}
              {name ? (
                <span className="text-[rgba(62,56,245)]"> {name}</span>
              ) : (
                <Skeleton className="h-3 w-3/5 rounded-lg" />
              )}
              !
            </h1>
            <p className="text-xl  text-slate-500 mt-1">
              Here is a list of your tasks
            </p>
          </div>
          <div className="flex gap-12  items-center justify-center">
            <Button
              className="rounded-lg bg-[rgba(62,56,245,0.9)] text-white font-medium"
              onClick={() => signUserOut()}
            >
              Sign-out
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-20 py-7 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-semibold flex gap-2">
              {greeting}
              {name ? (
                <span className="text-[rgba(62,56,245)]"> {name}</span>
              ) : (
                <span>
                  <Skeleton className="h-12 w-40 rounded-lg" />
                </span>
              )}
              !
            </h1>
            <p className="text-xl text-slate-500 mt-1">
              Here is a list of your tasks
            </p>
          </div>
          {name ? (
            <div className="flex gap-12  items-center justify-center">
              <TaskForm />
              <Button className="rounded-lg bg-slate-100">
                <Image src={exportIcon} width={20} alt="Plus"></Image>
                Export
              </Button>
              <Button
                className="rounded-lg bg-[rgba(62,56,245,0.9)] text-white font-medium"
                onClick={() => signUserOut()}
              >
                Sign-out
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
