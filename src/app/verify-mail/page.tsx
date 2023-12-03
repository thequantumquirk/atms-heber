"use client";
import { useToast } from "@/components/ui/use-toast";
import { resetPasswordWithEmail } from "@/server/auth/update-user";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {};

const VerifyMail = (props: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [mail, setMail] = useState("");

  const handleMail = (e: any) => {
    console.log(e.target.value);
    setMail(e.target.value);
  };

  async function sendOTP(mail: string) {
    console.log(mail);
    if (mail) {
      let { status, error, data } = await resetPasswordWithEmail(mail);
      if (status) {
        router.push("/");
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

  return (
    <div
      className="flex gap-20 flex-col justify-center items-center h-[100vh] bg-cover "
      style={{ backgroundImage: "url(./Login/circle-scatter.svg)" }}
    >
      <div className="w-full sm:w-[60vw] md:w-[52vw] lg:w-[40vw] xl:w-[30vw] 2xl:w-[25vw] p-8">
        <div className={`my-14 MoveUp`}>
          <h1 className="text-2xl sm:text-4xl font-semibold mb-6">E-Mail Verification</h1>
          <label className="text-lg font-medium">Your E-Mail ID</label>
          <br></br>
          <input
            className="border-2 border-grey-400 rounded-lg my-1 p-2 h-10 w-full"
            value={mail}
            onChange={handleMail}
            type="mail"
            placeholder="rollnoorstaffname@bhc.edu.in"
          ></input>
          <br></br>
          <Button
            onClick={() => {
              sendOTP(mail);
            }}
            className="bg-[#4d47eb] hover:bg-[hsl(242,80%,65%)] text-white px-5 py-2 mt-6 rounded p-1"
          >
            Send OTP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyMail;
