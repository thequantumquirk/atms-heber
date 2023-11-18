"use client"
import { useState } from "react";
import { signUp, login } from "@/server/auth/auth-user";
import vector from "../../../public/Login/signup-vector.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export default function Signup() {
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("")
  const router = useRouter();
  const { toast } = useToast()
  async function signupUser(name: string, email: string, password: string, role:string) {
    toast({
        description:"Loading...",
      }) 
    const res = await signUp(name, email, password, role);
    if (res.status) {
      login(email, password);
      toast({
        title: `Signed Up Successfully`,
        description:res.data,
      }) 
      router.push("/");
    } else {
        toast({
            description:res.error,
          })
    }
  }

  return (
    <div
      className="md:flex justify-center items-center bg-cover h-[100vh] bgImage"
      style={{ backgroundImage: "url(./Login/circle-scatter-2.svg)" }}
    >
      <div className="pt-12 md:w-[30vw] flex flex-col gap-2 md:gap-5 p-8">
        <h1 className="text-center mb-5 text-3xl sm:text-left font-medium sm:mb-2">
          Sign-Up to Continue
        </h1>
        <div>
          <label className="text-stone-500 font-medium">Name</label>
          <input
            className="w-full bg-slate-100 rounded px-4 py-2 "
            type="text"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <label className="text-stone-500  font-medium">Email ID</label>
          <input
            className="w-full bg-slate-100 rounded px-4 py-2"
            type="mail"
            id="name"
            required
            onChange={(e) => {
              setMail(e.target.value);
            }}
          ></input>
        </div>
        <div className="flex gap-4">
            <div>
          <label className="text-stone-500  font-medium">Enter Password</label>
          <input
            className="w-full bg-slate-100 rounded px-4 py-2"
            type="password"
            id="name"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          </div>
          <div>
          <label className="text-stone-500  font-medium">Role</label>
          <DropdownMenu>
                <DropdownMenuTrigger asChild><Button className="w-40 bg-slate-100 rounded px-4 py-2">{role}</Button></DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel>Your Role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                        <DropdownMenuRadioItem value="Student">Student</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Professor">Professor</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="HOD">Head of Department</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Button
          type="submit"
          className="p-2 mt-3 w-[6rem] mx-auto rounded text-white font-semibold bg-[hsl(242,80%,60%)] hover:bg-[hsl(242,80%,65%)] transition-all ease-linear"
          onClick={() => {
            signupUser(name, email, password, role);
          }}
        >
          Sign-Up{" "}
        </Button>
        <h3 className="text-center mt-1">
          Have an account?{" "}
          <a href="/login" className="text-[#4d47eb] underline">
            Login
          </a>
        </h3>
      </div>
      <Image src={vector} width={520} alt="Login Image"></Image>
    </div>
  );
}