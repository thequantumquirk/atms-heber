'use client'

import Dashboard from "@/components/dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession,signOut } from "@/server/auth/auth-user";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";


export default function Home() {
    const router = useRouter();
    useEffect(()=>{
        async function fetchSession(){
            const data = await getSession()
            if(data.data==null){
                router.push('/login')
            }
        }
        fetchSession()
    },[])
    const mail = useSelector((state: RootState) => state.auth.email);
    
    return (
        <>
            <Dashboard/>
           
        </>
    )
}
