import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

export default function Listing() {
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)


    useEffect(() => {

        const fetchListing = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }
                setListing(data)
                setLoading(false)
                setError(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }

        fetchListing()
    }, [params.listingId])

    SwiperCore.use([Navigation])

    return (
        <main>
            {loading && (<p className='text-center my-7 text-2xl'>Loading...</p>)}
            {error && (<h1 className='text-center my-7 text-red-700 font-semibold'>Something went wrong</h1>)}
            {!loading && !error && listing && (
                <>
                    <div>
                        <Swiper navigation>
                            {listing.imageUrls.map((url) => (
                                <SwiperSlide key={url}>
                                    <div
                                        className='h-[550px]'
                                        style={{ background: `url(${url}) center no-repeat` }}
                                    >

                                        <img src={url} className='h-[500px] object-cover' />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </>
            )
            }
        </main >
    )
}