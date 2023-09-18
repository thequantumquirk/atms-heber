import React from 'react'

type Props = {}

const resetPassword = (props: Props) => {
    return (
        <div className=' flex gap-20 flex-col justify-center items-center h-[80vh]'>

            <div className='w-[35vw] p-8'>
                <h1 className='text-3xl font-semibold mb-6'> Reset Password</h1>
                <label className='text-lg font-medium'>Old Password</label><br></br>
                <input className="border-2 border-grey-400 rounded-lg my-1 h-10 w-full p-1" type="text" name="oldPassword" id="oldPassword"></input><br></br>
                <label className='text-lg font-medium'>New Password</label><br></br>
                <input className="border-2 border-grey-400 rounded-lg my-1 h-10 w-full" type="text" name="newPassword" id="newPassword"></input><br></br>
                <button className='bg-[#4d47eb] text-white px-5 py-2 mt-6 rounded-xl p-1'> Confirm</button>
            </div>
        </div>
    )
}

export default resetPassword