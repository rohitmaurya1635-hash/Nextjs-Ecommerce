'use client'

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { useEffect, useState } from "react"

import Image from "next/image"
import { IoStar } from "react-icons/io5"
import useFetch from "@/hooks/useFetch"

const LatestReview = () => {
    const [latestReviews, setLatestReviews] = useState()
    const { data: getLatestTeviews, laoding } = useFetch('/api/dashboard/admin/latest-reviews')
    useEffect(() => {
        if (getLatestTeviews && getLatestTeviews.success) {
            setLatestReviews(getLatestTeviews.data)
        }
    }, [getLatestTeviews])

    if (laoding) return <div className="h-full w-full flex justify-center items-center">Loading...</div>

    if (!latestReviews || latestReviews.length === 0) return <div className="h-full w-full flex justify-center items-center">
        <Image src={'/assets/images/not-found.png'} height={100} width={100} alt="Not fount" className="w-20" />
    </div>
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {latestReviews?.map((review) => (
                    <TableRow key={review._id}>
                        <TableCell className='flex items-center gap-3'>
                            <Avatar>
                                <AvatarImage src={review?.product?.media[0]?.secure_url || "/assets/images/img-placeholder.webp"} alt={"logo"} />
                            </Avatar>
                            <span className="line-clamp-1">{review?.product?.name}</span>
                        </TableCell>
                        <TableCell>
                            <div className="flex">
                                {Array.from({ length: review.rating }).map((_, starIndex) => (
                                    <span key={starIndex}>
                                        <IoStar className="text-yellow-500" />
                                    </span>
                                ))}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LatestReview