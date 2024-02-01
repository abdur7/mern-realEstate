import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
    const { currentUser } = useSelector(state => state.user)
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <img className='h-24 w-24 rounded-full self-center object-cover cursor-pointer mt-2' src={currentUser.avatar} />
                <input type="text" id='username' placeholder='Username' className='border p-3 rounded-lg' />
                <input type="email" id='email' placeholder='Email' className='border p-3 rounded-lg' />
                <input type="password" id='password' placeholder='Password' className='border p-3 rounded-lg' />
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-50'>update</button>

            </form>
            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer'>Delete Account</span>
                <span className='text-red-700 cursor-pointer'>Logout</span>

            </div>
        </div>
    )
}
