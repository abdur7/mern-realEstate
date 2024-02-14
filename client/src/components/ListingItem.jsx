import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem({ listing }) {
    const { name,
        address,
        bathrooms,
        bedrooms,
        description,
        discountPrice,
        furnished,
        imageUrls,
        offer,
        parking,
        regularPrice,
        type

    } = listing
    return (
        <div
            className='bg-white w-full sm:w-[330px] shawdow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg'>
            <Link to={`/listing/${listing._id}`}>
                <img
                    src={imageUrls[0]}
                    alt="cover-image"
                    className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale'
                />
                <div className='p-3 flex flex-col gap-2 w-full '>
                    <p
                        className='text-lg font-semibold text-slate-700 truncate'>
                        {name}
                    </p>
                    <div className='flex items-center gap-1'>
                        <MdLocationOn className='text-green-700 h-4 w-4' />
                        <p className='truncate  text-sm text-gray-600'>{address}</p>
                    </div>
                    <p
                        className='text-sm text-gray-600 line-clamp-3'
                    >
                        {description}
                    </p>
                    <p className='text-slate-500 mt-2 font-semibold'>
                        $
                        {offer ? discountPrice.toLocaleString('en-Us') : regularPrice.toLocaleString('en-Us')}
                        {type === 'rent' && '/ month'}
                    </p>

                    <div className='text-slate-700 flex gap-4'>
                        <div className='font-bold text-xs'>
                            {bedrooms > 1 ? `${bedrooms} beds` : `${bedrooms} bed`}
                        </div>

                        <div className='font-bold text-xs'>
                            {bathrooms > 1 ? `${bathrooms} beds` : `${bathrooms} bed`}
                        </div>
                    </div>

                </div>
            </Link>
        </div>
    )
}
