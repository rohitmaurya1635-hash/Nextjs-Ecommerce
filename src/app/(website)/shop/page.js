'use client'

import React, { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import ButtonLoading from '@/components/Application/ButtonLoading'
import Filter from '@/components/Application/Website/Filter'
import ProductCard from '@/components/Application/Website/ProductCard'
import Sorting from '@/components/Application/Website/Sorting'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoutes'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import useWindowSize from '@/hooks/useWindowSize'

const bredcrumbs = {
    title: 'Shop',
    links: [
        { label: 'Shop', href: WEBSITE_SHOP }
    ]
}

const ShopPage = () => {
    const searchParams = useSearchParams().toString()
    const [limit, setLimit] = useState(9)
    const [sorting, setSorting] = useState('default')
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const windowSize = useWindowSize()

    const fetchProduct = async (pageParams) => {
        const { data: getProducts } = await axios.get(`/api/shop?page=${pageParams}&limit=${limit}&sort=${sorting}&${searchParams}`)

        if (!getProducts.success) {
            return;
        }

        return getProducts.data;
    }
    const { error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['products', limit, sorting, searchParams],
        queryFn: async ({ pageParam }) => await fetchProduct(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.nextPage ?? false;
        }
    })


    return (
        <div>
            <WebsiteBreadcrumb props={bredcrumbs} />
            <section className='lg:flex lg:px-32 px-4 my-20'>
                {windowSize.width >= 1024 ?
                    <div className='w-72 me-4'>
                        <div className='sticky top-0 bg-gray-50 p-4 rounded'>
                            <Filter />
                        </div>
                    </div>
                    :
                    <Sheet open={mobileFilterOpen} onOpenChange={() => setMobileFilterOpen(false)}>
                        <SheetContent side="left" className='block'>
                            <SheetHeader className='border-b'>
                                <SheetTitle>Filter</SheetTitle>
                            </SheetHeader>
                            <div className='p-p overflow-auto h-[calc(100vh-80px)]'>
                                <Filter />
                            </div>
                        </SheetContent>
                    </Sheet>
                }


                <div className='lg:w-[calc(100%-18rem)]'>
                    <Sorting
                        limit={limit}
                        setLimit={setLimit}
                        sorting={sorting}
                        setSorting={setSorting}
                        mobileFilterOpen={mobileFilterOpen}
                        setMobileFilterOpen={setMobileFilterOpen}
                    />

                    {isFetching && <div className='p-3 font-semibold text-center'>Loading...</div>}
                    {error && <div className='p-3 font-semibold text-center text-red-500'>{error.message}</div>}

                    <div className='grid lg:grid-cols-3 grid-cols-2 sm:gap-10 gap-5 my-10 '>
                        {data && data.pages.map(page => (
                            page.products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        ))}
                    </div>

                    {/* loadMore button */}
                    <div className='flex items-center justify-center'>
                        {hasNextPage ?
                            <ButtonLoading type="button" text='Load More' loading={isFetching} onClick={fetchNextPage} />
                            :
                            <>
                                {!isFetching && <span>No more data to load</span>}
                            </>
                        }
                    </div>

                </div>
            </section>
        </div>
    )
}

export default ShopPage