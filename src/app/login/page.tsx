"use client";
import { useState } from "react";
import { login } from "@/server/auth/auth-user";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@nextui-org/react";

const LoginPage = () => {
  const [email, setmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  async function LoginUser(email: string, password: string) {
    toast({
      description: "Loading...",
    });
    const res = await login(email, password);
    if (res.status) {
      toast({
        description: "Logged in Successfully",
      });
      router.push("/");
    } else {
      toast({
        description: res.error,
      });
    }
  }
  return (
    <div>
      <div
        className="flex justify-center items-center h-[100vh] flex-col gap-12 bg-cover "
        style={{ backgroundImage: "url(./Login/circle-scatter.svg)" }}
      >
        <h2 className="text-4xl text-center font-semibold">
          Welcome to <span className="text-[hsl(242,80%,60%)]">ATMS</span>
        </h2>
        <div className="md:w-[30vw] p-8 flex flex-col gap-5">
          <h1 className="text-3xl font-medium mb-2">Login</h1>
          <div>
            <label className="text-lg font-medium">Institutional Mail ID</label>
            <input
              className="w-full bg-slate-200 rounded-lg px-4 py-2 mt-2"
              type="mail"
              id="name"
              required
              onChange={(e) => {
                setmail(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="text-lg font-medium">Password</label>
            <input
              className="w-full bg-slate-200 rounded-lg px-4 py-2 mt-2"
              type="password"
              id="name"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="flex items-end justify-between">
            <Button
              type="submit"
              onClick={() => {
                LoginUser(email, password);
              }}
              className="p-2 w-[6rem] rounded text-white font-semibold bg-[hsl(242,80%,60%)] hover:bg-[hsl(242,80%,65%)] transition-all ease-linear"
            >
              Login
            </Button>
            <a
              href="/verify-mail"
              className="text-base text-[hsl(242,80%,60%)] underline"
            >
              Forgot password?
            </a>
          </div>
          <h3 className="text-center mt-3">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-[#4d47eb] underline">
              SignUp
            </a>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
