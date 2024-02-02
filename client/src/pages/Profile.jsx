import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../../firebase.js"


// firebase storage rules 
// allow read;
// allow write: if
// request.resource.size < 2 * 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')

export default function Profile() {
    const { currentUser } = useSelector(state => state.user)
    const [file, setFile] = useState(undefined)
    const [filePer, setFilePer] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    console.log(filePer)
    console.log(fileUploadError)
    console.log(formData)


    const fileRef = useRef(null)

    useEffect(() => {
        if (file) {
            handleFileUpload(file)

        }
    }, [file])

    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePer(Math.round(progress))
            },


            (error) => {
                setFileUploadError(true)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL })
                    setFileUploadError(null)
                })
            }
        );
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                <img src={currentUser.avatar} onClick={() => fileRef.current.click()} className='h-24 w-24 rounded-full self-center object-cover cursor-pointer mt-2' alt='profile' />
                <p className='text-sm text-center'>
                    {
                        fileUploadError ?
                            (<span className='text-red-700'>Error uploading image</span>) : filePer > 0 && filePer < 100 ? (
                                <span className='text-slate-700'>{`Uploading ${filePer}%`}</span>) : filePer === 100 ?
                                (<span className='text-green-700'>Successfully uploaded!</span>) : (""

                                )
                    }
                </p>

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
