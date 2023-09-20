"use client";
import { resetPasswordWithEmail } from "@/server/auth/update-user";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { email: string };

const resetPassword = ({ email }: Props) => {
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const router = useRouter()
    const resetPass = async () => {
        if (password1 === password2) {
            const { status, error, data } = await resetPasswordWithEmail(email);
            if (status) {
                alert("Password Updated Successfully")//Will change this soon to customized alert
                router.push('/')
            } else {
                alert(error)//Will change this soon to customized alert
            }
        }
        else {
            alert("Password did not match")
        }
    };
    return (
        <div className=' flex gap-20 flex-col justify-center items-center h-[100vh] bg-cover '
            style={{ backgroundImage: 'url(./Login/circle-scatter.svg)' }}>
            <div className="w-[35vw] p-8">
                <h1 className="text-3xl font-semibold mb-6">Reset Password</h1>
                <label className='text-lg font-medium'>Password</label>
                <input
                    className="border-2 border-grey-400 rounded-lg my-1 h-10 w-full"
                    type="text"
                    name="newPassword1"
                    id="newPassword1"
                    onChange={(e) => setPassword1(e.target.value)}
                ></input>
                <label className='text-lg font-medium'>Re-enter Password</label>
                <input
                    className="border-2 border-grey-400 rounded-lg my-1 h-10 w-full"
                    type="text"
                    name="newPassword2"
                    id="newPassword2"
                    onChange={(e) => setPassword2(e.target.value)}
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
