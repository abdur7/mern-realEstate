import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({ listing }) {

    const [landlord, setLandlord] = useState(null)
    const [landlordError, setLandlordError] = useState(null)
    const [message, setMessage] = useState("")

    const onChange = (e) => {
        setMessage(e.target.value)
    }

    useEffect(() => {


        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()

                if (data.success === false) {
                    setLandlordError(data.message)
                    return
                }

                setLandlord(data)


            } catch (error) {
                setLandlordError(error)
            }
        }
        fetchLandlord()
    }, [listing.userRef])
    return (
        <div >
            {
                landlord && (
                    <div className='flex flex-col gap-2'>
                        <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span>

                        </p>

                        <textarea
                            onChange={onChange}
                            value={message}
                            name="message"
                            id="message"
                            rows="2"
                            placeholder='Enter your message here...'
                            className='p-3 w-full border mt-2 rounded-lg border-gray-700'
                        ></textarea>
                        <Link
                            className='bg-slate-700 text-center p-3 rounded-lg text-white uppercase'
                            to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`}>
                            Send Message
                        </Link>
                    </div>
                )
            }
        </div>
    )
}
