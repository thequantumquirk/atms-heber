'use client'
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function Home() {
    // const router = useRouter();
    // useEffect(() => {
    //     const fetchSession = async () => {
    //         const sessionData = await getSession();
    //         console.log("sessionData", sessionData.status)
    //         if (sessionData.status == false) {
    //             router.push('/login');
    //         }
    //     };
    //     fetchSession();
    // });

    const mail = useSelector((state: RootState) => state.auth.email);
    return (
        <div className="text-black font-medium text-center text-3xl m-40">
            <span className="text-[hsl(242,80%,60%)]">{mail}</span><span> has Logged In Successfully!</span>
        </div>
    )
}
