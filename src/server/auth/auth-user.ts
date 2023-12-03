import { SupabaseResponse } from "@/types/supabase-types";
import supabase from "../supabase";
import { extractRollno } from "@/utilities/utillities";

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<SupabaseResponse> {
  if (!email.endsWith("@bhc.edu.in")) {
    return { status: false, error: "Invalid Email ID" };
  }
  let number = /\d/;
  let role = "Student";
  let role_power = 1;
  console.log(number.test(email));
  const detail = extractRollno(email);
  const roll_no = detail.roll_no;
  const dept = detail.dept;
  if (!number.test(email)) {
    role = "Faculty";
    role_power = 2;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        role_power,
        roll_no,
        dept,
      },
    },
  });
  console.log(data);
  if (error) {
    return { status: false, error: error.message };
  } else {
    return {
      status: true,
      data: data.user?.email,
      message: "User signed up successfully",
    };
  }
}

export async function login(
  email: string,
  password: string
): Promise<SupabaseResponse> {
  if (!email.endsWith("@bhc.edu.in")) {
    return { status: false, error: "Invalid Email ID" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log(data);
  if (error) {
    return { status: false, error: error.message };
  } else {
    return {
      status: true,
      data: data.user?.id,
      message: "User logged in successfully",
    };
  }
}

export async function signOut(): Promise<SupabaseResponse> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { status: false, error: error.message };
  } else {
    return { status: true, data: "User signed out successfully" };
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return { status: false, error: error.message };
  } else {
    return { status: true, data: data.session };
  }
}
