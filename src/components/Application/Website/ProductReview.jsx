'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Input } from '@/components/ui/input'
import { IoStar } from 'react-icons/io5'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Rating } from '@mui/material'
import ReviewList from './ReviewList'
import { Textarea } from '@/components/ui/textarea'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoutes'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import useFetch from '@/hooks/useFetch'
import { useForm } from 'react-hook-form'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const ProductReview = ({ productId }) => {
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const [isReview, setIsReview] = useState(false)
    const [reviewCount, setReviewCount] = useState(null)
    const auth = useSelector(store => store.authStore.auth)
    const pathname = usePathname();
    const { data: getReviewDeatils } = useFetch(`/api/review/details?productId=${productId}`)

    useEffect(() => {
        if (getReviewDeatils && getReviewDeatils.success) {
            setReviewCount(getReviewDeatils.data)
        }
    }, [getReviewDeatils])


    const formSchema = zSchema.pick({
        product: true,
        userId: true,
        rating: true,
        title: true,
        review: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: productId,
            userId: auth?._id,
            rating: 0,
            title: "",
            review: "",
        },
    })

    const onSubmit = async (values) => {
        try {
            setLoading(true)
            const { data: reviewResponse } = await axios.post('/api/review/create', values)
            if (!reviewResponse.success) {
                throw new Error(reviewResponse.message)
            }
            form.reset()
            showToast('success', reviewResponse.message)
            queryClient.invalidateQueries(['product-review'])
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchReview = async (pageParam) => {
        const { data: getReviewData } = await axios.get(`/api/review/get?productId=${productId}&page=${pageParam}`)
        if (!getReviewData.success) {
            return
        }
        return getReviewData.data
    }

    const { error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['product-review'],
        queryFn: async ({ pageParam }) => await fetchReview(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.nextPage
        }
    })

    return (
        <div className="shadow rounded border">
            <div className="p-3 bg-gray-50 border-b">
                <h2 className="font-semibold text-2xl">Rating & Reviews</h2>
            </div>
            <div className="p-5">
                <div className='flex justify-between items-center flex-wrap'>
                    <div className='md:w-1/2 w-full md:flex md:gap-10 md:mb-0 mb-5'>
                        <div className='md:w-[200px] w-full md:mb-0 mb-5'>
                            <h4 className='text-center text-8xl font-semibold'>{reviewCount?.averageRating.toFixed(1)}</h4>
                            <div className='flex justify-center gap-2'>
                                <IoStar />
                                <IoStar />
                                <IoStar />
                                <IoStar />
                                <IoStar />
                            </div>

                            <p className='text-center mt-3'>
                                ({reviewCount?.totalReviews} Rating & Reviews)
                            </p>
                        </div>

                        <div className='md:w-[calc(100%-200px)] flex items-center'>
                            <div className='w-full'>
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div key={rating} className='flex items-center gap-2 mb-2'>
                                        <div className='flex items-center gap-1'>
                                            <p className='w-3'>{rating}</p>
                                            <IoStar />
                                        </div>
                                        <Progress value={reviewCount?.percentage[rating]} />
                                        <span className='text-sm'>{reviewCount?.rating[rating]}</span>
                                    </div>
                                ))}


                            </div>
                        </div>

                    </div>

                    <div className='md:w-1/2 w-full md:text-end text-center'>
                        <Button onClick={() => { setIsReview(!isReview) }} type='button' variant="outline" className='md:w-fit w-full py-6 px-10'>Write Review</Button>
                    </div>
                </div>

                {isReview &&
                    <div className='my-5'>
                        <hr className='mb-5' />
                        <h4 className='text-xl font-semibold mb-3'>Write A Review</h4>
                        {!auth ?
                            <>
                                <p className='mb-2'>Login to submit review</p>
                                <Button type="button" asChild>
                                    <Link href={`${WEBSITE_LOGIN}?callback=${encodeURIComponent(pathname)}`}>Login</Link>
                                </Button>
                            </>
                            :
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>

                                    {/* Category Name */}
                                    <div className='mb-5'>
                                        <FormField
                                            control={form.control}
                                            name="rating"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Rating
                                                            value={field.value}
                                                            size='large'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Title */}
                                    <div className='mb-5'>
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Enter Review title" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='mb-5'>
                                        <FormField
                                            control={form.control}
                                            name="review"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Review</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Enter your review" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='mb-3'>
                                        <ButtonLoading type="submit" text="Submit Review" loading={loading} className="cursor-pointer" />
                                    </div>
                                </form>
                            </Form>
                        }

                    </div>
                }

                <div className='mt-10 border-t pt-5'>
                    <h5 className='text-xl font-semibold'>{data?.pages[0]?.totalReview} Reviews</h5>

                    <div className='mt-10'>
                        {data && data.pages.map((page) =>
                            page.reviews.map((review) => (
                                <div key={review._id} className='mb-3'>
                                    <ReviewList review={review} />
                                </div>
                            ))
                        )}

                        {hasNextPage &&
                            <ButtonLoading type='Button' text='Load More' loading={isFetching} onClick={fetchNextPage}  />
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProductReview