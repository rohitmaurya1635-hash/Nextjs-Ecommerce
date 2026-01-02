import Image from 'next/image'
import { IoStar } from 'react-icons/io5';
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";

const ReviewList = ({ review }) => {
    dayjs.extend(relativeTime);
    return (
        <div className='flex gap-5'>
            <div className='w-[60px]'>
                <Image
                    src={review?.avatar?.url || '/assets/images/user.png'}
                    width={55}
                    height={55}
                    alt="user Icon"
                    className='rounded-lg'
                />
            </div>
            <div className='w-[calc(100%-100px)]'>
                <div>
                    <h4 className='text-xl font-semibold'>{review?.title}</h4>
                    <p className='flex gap-2 items-center'>
                        <span className='font-medium'>{review?.reviewedBy}</span>
                        -
                        <span className='text-gray-500'>{dayjs(review?.createdAt).fromNow()}</span>
                    </p>
                    <span className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <IoStar
                                key={index}
                                className={index < review?.rating ? "text-yellow-500" : "text-gray-300"}
                            />
                        ))}
                    </span>
                    <p className='mt-3 text-gray-600'>{review?.review}</p>
                </div>
            </div>
        </div>
    )
}

export default ReviewList