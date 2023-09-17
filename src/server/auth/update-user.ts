import { SupabaseResponse } from "@/types/SupabaseTypes";
import supabase from "../supabase";

export async function verifySignupOtp(
  email: string,
  token: string
): Promise<SupabaseResponse> {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) {
    return { status: false, error: error.message };
  } else {
    return { status: true, data: "OTP verified successfully" };
  }
}

export async function resendSignupOtp(
  email: string
): Promise<SupabaseResponse> {
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email: "email@example.com",
  });
  if (error) {
    return { status: false, error: error.message };
  } else {
    return { status: true, data: `OTP has been resent to ${email}` };
  }
}

export async function updatePassword(
  password: string
): Promise<SupabaseResponse> {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  if (error) {
    return { status: false, error: error.message };
  } else {
    return { status: true, data: "Your password has been reset successfully" };
  }
}
