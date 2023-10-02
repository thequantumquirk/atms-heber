"use client";

import Dashboard from "@/components/dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession, signOut } from "@/server/auth/auth-user";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import HOD from "@/components/hod";
import Staff from "@/components/staff";
import Student from "@/components/student";
import Principal from "@/components/principal";


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
    

    let pageComponent;
  switch (mail) {
    case 'hod@bhc.edu.in':
      pageComponent = <HOD />;
      break;
    case 'staff@bhc.edu.in':
      pageComponent = <Staff />;
      break;
    case 'cs215114102@bhc.edu.in':
      pageComponent = <Student />;
      break;
    case 'principal@bhc.edu.in':
      pageComponent = <Principal />;
      break;
    default:
      // Handle cases where 'page' doesn't match any known page
      pageComponent = <div>Page not found</div>;
  }
    
    return (
        <>  
        {pageComponent}
        </>
    )
}
