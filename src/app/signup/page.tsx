"use client";
import { useState } from "react";
import { signUp, login } from "@/server/auth/auth-user";
import vector from "../../../public/Login/signup-vector.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";

export default function Signup() {
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  async function signupUser(name: string, email: string, password: string) {
    const res = await signUp(name, email, password);
    if (res.status) {
      login(email, password);
      toast({
        title: `Logged In Successfully`,
        description: res.data,
      });
      router.push("/");
    } else {
      toast({
        description: res.error,
      });
    }
  }

  return (
    <div
      className="md:flex justify-center items-center bg-cover h-[100vh] bgImage"
      style={{ backgroundImage: "url(./Login/circle-scatter-2.svg)" }}
    >
      <div className="w-full md:w-[45vw] lg:w-[40vw] xl:w-[30vw] pt-12 flex flex-col gap-2 md:gap-5 p-8">
        <h1 className="text-center mb-5 text-3xl sm:text-left font-medium sm:mb-2">
          Sign-Up to Continue
        </h1>
        <div>
          <label className="text-lg font-medium">Name</label>
          <input
            className="w-full bg-slate-200 rounded-lg p-3 mt-2"
            type="text"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <label className="text-lg font-medium">Email ID</label>
          <input
            className="w-full bg-slate-200 rounded-lg p-3 mt-2"
            type="mail"
            id="name"
            required
            onChange={(e) => {
              setMail(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <label className="text-lg font-medium">Enter Password</label>
          <input
            className="w-full bg-slate-200 rounded-lg p-3 mt-2"
            type="password"
            id="name"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>
        <Button
          type="submit"
          className="p-2 mt-3 w-[6rem] mx-auto rounded text-white font-semibold hover:bg-indigo-600 bg-indigo-500 transition-all ease-linear"
          onClick={() => {
            signupUser(name, email, password);
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
      <Image src={vector} alt="Login Image" className="w-[480px] md:w-[360px] lg:w-[540px]"></Image>
    </div>
  );
}
