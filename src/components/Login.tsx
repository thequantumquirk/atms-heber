'use client'
import {useState} from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return(
        <div>
        <h2 className="text-4xl text-center"> 
            Login To Your Account
        </h2>
        </div>
    )

}

export default LoginPage
