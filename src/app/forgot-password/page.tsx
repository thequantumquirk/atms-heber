"use client";
import { resetPasswordWithEmail } from "@/server/auth/update-user";
import { useState } from "react";

type Props = {};

const resetPassword = (props: Props) => {
  const [email, setEmail] = useState("");
  const resetPass = async () => {
    const { status, error, data } = await resetPasswordWithEmail(email);
    if (status) {
      // push to another page or homescreen
      // show that password reset has been sent
      console.log(data);
    } else {
      // show the error
      console.log(error);
    }
  };
  return (
    <div className=" flex gap-20 flex-col justify-center items-center h-[80vh]">
      <div className="w-[35vw] p-8">
        <h1 className="text-3xl font-semibold mb-6"> Reset Password</h1>
        <input
          className="border-2 border-grey-400 rounded-lg my-1 h-10 w-full"
          type="text"
          name="newPassword"
          id="newPassword"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <br></br>
        <button
          className="bg-[#4d47eb] text-white px-5 py-2 mt-6 rounded-xl p-1"
          onClick={resetPass}
        >
          {" "}
          Confirm
        </button>
      </div>
    </div>
  );
};

export default resetPassword;
