import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

export default function Search() {
    const [sidebardata, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc'
    })
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState([])
    const [showMore, setShowMore] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc'

            })
        }

        const fetchListing = async () => {
            try {
                setLoading(true)
                setShowMore(false)
                const searchQuery = urlParams.toString()
                const res = await fetch(`/api/listing/get?${searchQuery}`)
                const data = await res.json()

                setListing(data)
                setLoading(false)
                if (data.length > 8) {
                    setShowMore(true)
                } else {
                    setShowMore(false)
                }

            } catch (error) {
                setLoading(false)

            }
        }
        fetchListing()
    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData({
                ...sidebardata,
                type: e.target.id
            })
        }
        if (e.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebardata,
                searchTerm: e.target.value
            })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebarData({
                ...sidebardata,
                [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false
            })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'desc';

            setSidebarData({
                ...sidebardata, sort, order
            })
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebardata.searchTerm)
        urlParams.set('type', sidebardata.type)
        urlParams.set('parking', sidebardata.parking)
        urlParams.set('furnished', sidebardata.furnished)
        urlParams.set('offer', sidebardata.offer)
        urlParams.set('sort', sidebardata.sort)
        urlParams.set('order', sidebardata.order)

        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const showMoreClick = async () => {
        const numberOfListings = listing.length
        const startIndex = numberOfListings;
        const UrlParams = new URLSearchParams(location.search)
        UrlParams.set('startIndex', startIndex)
        const searchQuery = UrlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json()
        if (data.length < 9) {
            setShowMore(false)

        }
        setListing([...listing, ...data])
    }
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2 '>
                        <label className='font-semibold' >Search</label>
                        <input
                            className='w-full border rounded-lg p-3'
                            placeholder='search'
                            type="text"
                            id="searchTerm"
                            value={sidebardata.searchTerm}
                            onChange={handleChange}

                        />
                    </div>

                    <div className='flex items-center flex-wrap gap-2 '>
                        <label className='font-semibold'>Type :</label>
                        <div className='flex gap-2'>
                            <input
                                className='w-5'
                                type="checkbox"
                                id="all"
                                checked={sidebardata.type === 'all'}
                                onChange={handleChange}
                            />
                            <span>Rent & Sell</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                className='w-5'
                                type="checkbox"
                                id="rent"
                                onChange={handleChange}
                                checked={sidebardata.type === 'rent'}

                            />
                            <span>Rent</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                className='w-5'
                                type="checkbox"
                                id="sale"
                                checked={sidebardata.type === 'sale'}
                                onChange={handleChange}
                            />
                            <span>Sale</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                className='w-5'
                                type="checkbox"
                                id="offer"
                                onChange={handleChange}
                                checked={sidebardata.offer}

                            />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className='flex items-center flex-wrap gap-2 '>
                        <label className='font-semibold'>Amenities :</label>
                        <div className='flex gap-2'>
                            <input
                                className='w-5'
                                type="checkbox"
                                id="parking"
                                checked={sidebardata.parking}
                                onChange={handleChange}
                            />
                            <span>Parking</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                className='w-5'
                                type="checkbox"
                                id="furnished"
                                checked={sidebardata.furnished}
                                onChange={handleChange}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className='font-semibold' >Sort:</label>
                        <select
                            id="sort_order"
                            className='border rounded-lg p-3'
                            onChange={handleChange}
                            defaultValue={'createdAt_desc'}
                        >
                            <option value="regularPrice_desc">Price high to low</option>
                            <option value="regularPrice_asc">Price low to high</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>

                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85'>Search</button>

                </form>
            </div>

            <div className='flex-1'>
                <h1 className='text-3xl mt-5 font-semibold border-b p-3 text-slate-700'>
                    Listing(s) :
                </h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {
                        !loading && listing.length === 0 && (
                            <p className='text-slate-700 text-xl '>No Listing Found!</p>
                        )

                    }
                    {
                        loading && (
                            <p className='text-slate-700 w-full text-center'>Loading...</p>
                        )
                    }
                    {
                        !loading && listing && listing.map((item) => (
                            <ListingItem key={item._id} listing={item} />
                        ))
                    }

                    {
                        showMore && (
                            <button
                                onClick={showMoreClick}
                                className='text-green-500 w-full text-center hover:underline'
                            >
                                Show More
                            </button>
                        )
                    }
                </div>

            </div>
        </div>
    )
}
