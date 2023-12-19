"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  resetPasswordWithEmail,
  updatePassword,
} from "@/server/auth/update-user";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {};

const ForgotPassword = (props: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [mail, setMail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleMail = (e: any) => {
    setMail(e.target.value);
  };

  async function sendOTP(mail: string) {
    if (mail) {
      let { status, error, data } = await resetPasswordWithEmail(mail);
      if (status) {
        setShowPassword(true);
        toast({
          description: data,
        });
      } else {
        toast({
          description: error,
        });
      }
    }
  }
  const updatePass = async () => {
    if (otp && password === confPassword) {
      const { status, error, data } = await updatePassword(mail, otp, password);
      if (status) {
        router.push("/");
        toast({
          description: "Password Updataed Succesfully",
        });
      } else {
        toast({
          description: error,
        });
      }
    } else {
      toast({
        description: "Password mismatch. Enter Again",
      });
    }
  };
  return (
    <div
      className="flex gap-20 flex-col justify-center items-center h-[100vh] bg-cover "
      style={{ backgroundImage: "url(./Login/circle-scatter.svg)" }}
    >
      <div className="mx-auto max-w-sm bg-white p-6 shadow-lg rounded-lg">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Forgot Password</h2>
            <p>Enter your email below to receive OTP and reset your password</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                onChange={handleMail}
              />
            </div>
            <Button className="w-full" onClick={() => sendOTP(mail)}>
              Send OTP
            </Button>
            {showPassword && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    placeholder="Enter OTP"
                    required
                    type="text"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    placeholder="Enter new password"
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    required
                    type="password"
                    onChange={(e) => setConfPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={() => updatePass()}>
                  Reset Password
                </Button>
              </>
            )}
          </div>
          <div className="mt-4 text-center text-sm">
            Remember your password?
            <Link className="underline" href="#">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
