
"use client";
import { useState } from "react";
import Link from "next/link";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <div className='flex justify-center items-center h-[100vh] flex-col gap-12 bg-cover '
                style={{ backgroundImage: 'url(./Login/circle-scatter.svg)' }}>
                <h2 className="text-4xl text-center font-semibold">
                    Welcome to <span className='text-[hsl(242,80%,60%)]'>Heber Dashboard</span>
                </h2>
                <div className='md:w-[30vw] p-8 flex flex-col gap-5'>
                    <h1 className='text-3xl font-medium mb-2'>Login</h1>
                    <div>
                        <label className='text-lg font-medium'>Institutional Mail ID</label>
                        <input className='w-full bg-slate-200 rounded-lg px-4 py-2 mt-2'
                            type="mail"
                            id="name"
                            required
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label className='text-lg font-medium'>Password</label>
                        <input className='w-full bg-slate-200 rounded-lg px-4 py-2 mt-2'
                            type="password"
                            id="name"
                            required
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <div className='flex items-end justify-between'>
                        <button type='submit' className='p-2 w-[6rem] rounded-lg text-white font-semibold bg-[hsl(242,80%,60%)] hover:bg-[hsl(242,80%,65%)] transition-all ease-linear'>Login</button>
                        <a href="/forgot-password" className='text-base text-[hsl(242,80%,60%)] underline'>Forgot password?</a>
                    </div>
                    <h3 className='text-center mt-3'>Don't have an account? <a href="/SignUp" className='text-[#4d47eb] underline'>SignUp</a></h3>
                </div>
            </div>
        </div>


    );
};

export default LoginPage;