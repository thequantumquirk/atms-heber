"use client";
import { updatePassword } from "@/server/auth/update-user";
import supabase from "@/server/supabase";
import { useEffect, useState } from "react";

function UpdatePassword() {
  const [password, setPassword] = useState("");
  const updatePass = async () => {
    const { status, error, data } = await updatePassword(password);
    if (status) {
      // push to homescreen
      // show that password has been reset
      console.log(data);
    } else {
      // show the error
      console.log(error);
    }
  };
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== "PASSWORD_RECOVERY") {
        // if there's no password recovery event (this will event will be set by supabase when the reset link is clicked)
        // push to home since its a protected page (we don't want anyone to open this page until or unless there's a reset req)
      }
    });
  }, []);
  return <div>{/*get user password and pass it to updatePassword*/}</div>;
}

export default UpdatePassword;
