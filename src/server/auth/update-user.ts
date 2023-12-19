import { SupabaseResponse } from "@/types/supabase-types";
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
    email,
  });
  if (error) {
    return { status: false, error: error.message };
  } else {
    return { status: true, data: `OTP has been resent to ${email}` };
  }
}
const redirectURL = `${
  process.env.NEXT_PUBLIC_SITE_URL || ""
}/update-password/`;
export async function resetPasswordWithEmail(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectURL,
  });
  if (error) {
    return { status: false, error: error.message };
  } else {
    return {
      status: true,
      data: `Your password reset link has been sent to ${email}`,
    };
  }
}

export async function updatePassword(
  email: string,
  token: string,
  password: string
): Promise<SupabaseResponse> {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (data) {
    const { data: passwordData, error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      return { status: false, error: error.message };
    } else {
      return {
        status: true,
        data: "Your password has been reset successfully",
      };
    }
  } else {
    return {
      status: false,
      data: error?.message,
    };
  }
}
