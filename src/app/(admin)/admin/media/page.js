'use client'

import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoutes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { Button } from '@/components/ui/button'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Media } from '@/components/Application/Admin/Media'
import { Skeleton } from '@/components/ui/skeleton'
import { UploadMedia } from '@/components/Application/Admin/UploadMedia'
import axios from 'axios'
import useDeleteMutation from '@/hooks/useDeleteMutation'
import { useSearchParams } from 'next/navigation'

const breadcrumbData = [
    { label: 'Home', href: ADMIN_DASHBOARD },
    { label: 'Media', href: "" }
]

const MediaPage = () => {
    const [deleteType, setDeleteType] = useState('SD')
    const [selectedMedia, setSelectedMedia] = useState([])
    const [selectAll, setSelectAll] = useState(false)

    const searchParams = useSearchParams()
    const deleteMutation = useDeleteMutation('media-data', '/api/media/delete')
    const queryClient = useQueryClient()


    useEffect(() => {
        if (searchParams) {
            const trashOf = searchParams.get('trashof')
            setSelectedMedia([])
            if (trashOf) {
                setDeleteType('PD')
            } else {
                setDeleteType('SD')
            }
        }
    }, [searchParams])


    const handleDelete = (ids, deleteType) => {
        let c = true;
        if (deleteType === 'PD') {
            c = confirm('Are you sure you want to delete data permanently')
        }
        if (c) {
            deleteMutation.mutate({ ids, deleteType })
        }
        setSelectAll(false)
        setSelectedMedia([])
    }

    const handleSelectAll = () => {
        setSelectAll(!selectAll)
    }

    useEffect(() => {
        if (selectAll) {
            const ids = data.pages.flatMap(page => page.mediaData.map(media => media._id))
            setSelectedMedia(ids)
        } else {
            setSelectedMedia([])
        }
    }, [selectAll])



    const fetchMedia = async (page, deleteType) => {
        const { data: response } = await axios.get(`/api/media/?page=${page}&limit=10&deleteType=${deleteType}`)
        return response
    }

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['media-data', deleteType],
        queryFn: async ({ pageParam }) => fetchMedia(pageParam, deleteType),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length
            return lastPage.hasMore ? nextPage : undefined
        },
    })

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-2 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex items-center justify-between'>
                        <h4 className='font-semibold text-xl uppercase'>{deleteType === 'SD' ? 'Media' : 'Trash Media'}</h4>
                        <div className='flex items-center gap-5'>
                            {deleteType === 'SD' &&
                                <UploadMedia isMultipal={true} queryClient={queryClient} />
                            }
                            <div className='fles gap-3'>
                                {deleteType === 'SD'
                                    ?
                                    <Button type="button" variant="destructive" asChild>
                                        <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                                            Trash
                                        </Link>
                                    </Button>
                                    :
                                    <Button type="button" asChild>
                                        <Link href={ADMIN_MEDIA_SHOW}>
                                            Back To Media
                                        </Link>
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>

                    {selectedMedia.length > 0 &&
                        <div className='py-2 px-3 mb-2 bg-violet-200 rounded flex justify-between items-center'>
                            <Label>
                                <Checkbox
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                    className='border-primary'
                                />
                                Select All
                            </Label>
                            <div className='flex gap-2'>
                                {deleteType === 'SD'
                                    ?
                                    <Button variant="destructive" onClick={() => handleDelete(selectedMedia, deleteType)}>
                                        Move Into trash
                                    </Button>
                                    :
                                    <React.Fragment>
                                        <Button className='bg-green-500 hover:bg-green-600' onClick={() => handleDelete(selectedMedia, 'RSD')}>
                                            Restore
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleDelete(selectedMedia, deleteType)}>
                                            Delete Permanently
                                        </Button>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    }

                    {status === 'pending'
                        ?
                        <div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5'>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden">
                                    {/* Checkbox placeholder */}
                                    <div className="absolute top-2 left-2 z-20">
                                        <Skeleton className="w-5 h-5 rounded border" />
                                    </div>

                                    {/* Dropdown placeholder */}
                                    <div className="absolute top-2 right-2 z-20">
                                        <Skeleton className="w-7 h-7 rounded-full" />
                                    </div>

                                    {/* Image placeholder */}
                                    <div>
                                        <Skeleton className="object-cover w-full sm:h-[200px] h-[150px]" />
                                    </div>

                                    {/* Hover overlay simulation */}
                                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-all duration-150" />
                                </div>
                            ))}
                        </div>
                        :
                        status === 'error' ?
                            <div className='text-red-500 text-sm'>
                                {error.message}
                            </div>
                            :
                            <>
                                {data.pages.flatMap(page => page.mediaData.map(media => media._id)).length === 0 &&
                                    <div className='text-center text-red-500'>
                                        No Media Avaiable
                                    </div>
                                }
                                <div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5'>
                                    {data?.pages?.map((page, index) => (
                                        <React.Fragment key={index}>
                                            {page?.mediaData?.map((media) => (
                                                <Media
                                                    key={media._id}
                                                    media={media}
                                                    handleDelete={handleDelete}
                                                    deletetype={deleteType}
                                                    selectedMedia={selectedMedia}
                                                    setSelectedMedia={setSelectedMedia}
                                                />
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </>
                    }
                    {hasNextPage &&
                        <ButtonLoading type='button' text='Load More' loading={isFetching} onClick={() => fetchNextPage()} />
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default MediaPage