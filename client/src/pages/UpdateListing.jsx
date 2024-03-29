import React, { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../../firebase.js"
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'


export default function UpdateListing() {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [fileUploadPer, setFileUploadPer] = useState(0)
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate()
    const params = useParams()



    useEffect(() => {

        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`)
            const data = await res.json()
            if (data.success === false) {
                console.log("error fetching data for this listing.")
            }

            setFormData(data)
        }

        fetchListing()
    }, [])



    const handleImageSubmit = (e) => {
        e.preventDefault()

        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            const promises = [];
            setUploading(true)
            setImageUploadError(false)
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }

            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                setImageUploadError(false)
                setUploading(false)
            }).catch((error) => {
                setImageUploadError("Image upload failed ( 2MB max per image )")
                setUploading(false)
            })

        } else if (files.length === 0) {
            setImageUploadError('Select Image to upload ')
            setUploading(false)

        } else {
            setImageUploadError('You can only upload 6 images per lisitng. ')
            setUploading(false)
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setFileUploadPer(Math.round(progress))
                }


                , (error) => {
                    reject(error)
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
        setFiles([])
        setFileUploadPer(null)
    }

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.imageUrls.length < 1) return setError("You must upload at least one image")
        if (formData.regularPrice < +formData.discountPrice) return setError("Discount price must be lower than regular price")
        try {

            setLoading(true)
            setError(false)

            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            })

            const data = await res.json()
            setLoading(false)

            if (data.success === false) {
                setLoading(false)
                setError(data.message)
            }

            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    return (
        <main className='p-4 max-w-4xl mx-auto'>
            <h1 className='text-3xl text-center my-7 font-semibold'>Edit a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-5' >
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type="text"
                        onChange={handleChange}
                        value={formData.name}
                        id='name'
                        placeholder='Name'
                        className='p-3 rounded-lg border'
                        maxLength="62"
                        minLength="10"
                        required
                    />

                    <textarea
                        type="text"
                        id='description'
                        onChange={handleChange}
                        value={formData.description}
                        placeholder='Description'
                        className='p-3 rounded-lg border'
                        required
                    />

                    <input
                        type="text"
                        id='address'
                        onChange={handleChange}
                        value={formData.address}
                        placeholder='Address'
                        className='p-3 rounded-lg border'
                        required
                    />

                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-1'>
                            <input
                                type="checkbox"
                                id="sale"
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.type === 'sale'}
                            />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-1'>
                            <input
                                type="checkbox"
                                id="rent"
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.type === 'rent'}

                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-1'>
                            <input
                                type="checkbox"
                                id="parking"
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-1'>
                            <input
                                type="checkbox"
                                id="furnished"
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-1'>
                            <input
                                type="checkbox"
                                id="offer"
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex items-center gap-2'>
                            <input
                                type="number"
                                id="bedrooms"
                                min="1"
                                max="10"
                                required
                                className='border-gray-300 rounded-lg p-3'
                                onChange={handleChange}
                                value={formData.bedrooms}
                            />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type="number"
                                id="bathrooms"
                                min="1"
                                max="10"
                                required
                                className='border-gray-300 rounded-lg p-3'
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type="number"
                                id="regularPrice"
                                min="50"
                                max="10000000"
                                required
                                className='border-gray-300 rounded-lg p-3'
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />
                            <div className='flex  flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>

                        </div>
                        {formData.offer && (

                            <div className='flex items-center gap-2'>
                                <input
                                    type="number"
                                    id="discountPrice"
                                    min="0"
                                    max="1000000"
                                    required
                                    className='border-gray-300 rounded-lg p-3'
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className='flex  flex-col items-center'>
                                    <p>Discounted price</p>
                                    <span className='text-sm'>($ / month)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex flex-col flex-1'>

                    <p className='font-semibold'>
                        Images:
                        <span className='text-gray-600 font-normal ml-2'>The first image will be cover ( max 6 )</span>
                    </p>

                    <div className='flex gap-4 mt-2'>
                        <input onChange={e => setFiles(e.target.files)} style={{ border: "1px solid gray" }} className='p-3 rounded w-full' type="file" id="images" accept='image/*' multiple />
                        <button disabled={uploading} type='button' onClick={handleImageSubmit} style={{ border: "1px solid green" }} className='p-3 text-green-700  uppercase rounded hover:shadow-lg disabled:opacity-80'>
                            {uploading ? "Uploading..." : "Upload"}
                        </button>


                    </div>
                    {
                        imageUploadError ?
                            (<span className='text-red-700'> {imageUploadError} </span>) : fileUploadPer > 0 && fileUploadPer < 100
                                ? (<span className='text-slate-700'> {`Uploading ${fileUploadPer}%`} </span>) : fileUploadPer === 100
                                    ? (<span className='text-green-700'>Uploaded successfully</span>) : ("")
                    }
                    {
                        formData.imageUrls?.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className='flex justify-between p-3 border mt-3'>
                                <img src={url} alt='lisitng image' className='w-20 h-20 object-contain rounded-lg' />
                                <button onClick={() => handleRemoveImage(index)} type="button" className='text-red-700 p-3 rounded uppercase hover:opacity-75'>Delete</button>
                            </div>
                        ))
                    }

                    <button disabled={loading || uploading} className='bg-slate-700 text-white p-3 uppercase mt-5 rounded-lg hover:opacity-80 disabled:opacity-50'>{loading ? "Updating..." : "Update Lisitng"} </button>
                    <p className='text-red-700 text-sm'>{error}</p>
                </div>

            </form >
        </main >
    )
}
