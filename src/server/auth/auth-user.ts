import { SupabaseResponse } from "@/types/supabase-types";
import supabase from "../supabase";

export async function signUp(
  email: string,
  password: string
): Promise<SupabaseResponse> {
  if (!email.endsWith("@bhc.edu.in")) {
    return { status: false, error: "Invalid Email ID" };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
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
      data: data.user?.email,
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
  }
  console.log(data);
}
