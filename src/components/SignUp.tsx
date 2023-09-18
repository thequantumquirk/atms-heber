'use client'
import {useState} from 'react';
import { signUp } from "@/server/auth/auth-user";
import vector from "../../public/Login/signup-vector.svg"
import Image from "next/image";
export default function Signup() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        async function signupUser(email: string, password: string) {
            const res = await signUp(email, password);
            if (res.status) {
                console.log(res.data);
            } else {
                console.log(res.error);
            }
        }

        return(
            <div className='flex justify-center items-center bg-cover h-[100vh]'
            style={{backgroundImage : 'url(./Login/circle-scatter-2.svg)'}}>
                <div className='w-[30vw] flex flex-col gap-5 p-8'>
                    <h1 className="text-3xl font-medium mb-2">Sign-Up to Continue</h1>
                    <div>
                    <label className='text-lg font-medium'>Email ID</label>
                    <input
                        className='w-full bg-slate-200 rounded-lg px-4 py-2 mt-2'
                        type="mail"
                        id="name"
                        required
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    ></input> 
                    </div>
                    <div>
                    <label className='text-lg font-medium'>Enter Password</label>
                    <input
                        className='w-full bg-slate-200 rounded-lg px-4 py-2 mt-2'
                        type="password"
                        id="name"
                        required
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    ></input>  
                    </div>
                    <button type='submit' className='p-2 mt-3 w-[6rem] mx-auto rounded-lg text-white font-semibold bg-[hsl(242,80%,60%)] hover:bg-[hsl(242,80%,65%)] transition-all ease-linear'
                    onClick={() => {
                        signupUser(email, password);
                    }}
                    >Sign-Up </button>
                    <h3 className='text-center mt-1'>Have an account? <a href="/Login" className='text-[#4d47eb] underline'>Login</a></h3>
                </div>
                <Image src={vector} width={520} alt="Login Image"></Image>
            </div>
            

        )
}