'use client'
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Dashboard from "@/components/dashboard";


export default function Home() {
    const mail = useSelector((state: RootState) => state.auth.email);
    return (
        <>
            <Dashboard />
        </>
    )
}
