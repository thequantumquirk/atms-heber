'use client'
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { getSession, signOut } from "@/server/auth/auth-user";
import { MilestoneType } from "@/types/milestone-type";
import { TaskType } from "@/types/tasktype";
import { Principal } from "@/data/data";

export default function Home() {
    // const router = useRouter();
    // useEffect(() => {
    //     const fetchSession = async () => {
    //         const sessionData = await getSession();
    //         console.log("sessionData", sessionData.status)
    //         if (sessionData.status == false) {
    //             router.push('/login');
    //         }
    //     };
    //     fetchSession();
    // });

    const mail = useSelector((state: RootState) => state.auth.email);
    return (
        <div className="">
            <span className="text-[hsl(242,80%,60%)]">{mail}</span><span> has Logged In Successfully!</span>
            {/* <button onClick={()=>{signOut()}}>Sign Out</button> */}
            <p>
                {/* {
                    Principal.map((Assigned, key)=>{
                        return(
                            <div key={key}>
                                {Assigned.to}<br></br>
                                {Assigned.role}<br></br>
                                {Assigned.task.name}<br></br>
                                {Assigned.task.description}<br></br>
                            </div>
                        )
                    })
                } */}
            </p>
        </div>
    )
}
