'use client'

import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoutes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect, useState } from 'react'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import useFetch from '@/hooks/useFetch'
import { useForm } from 'react-hook-form'
import { useParams } from 'next/navigation'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const breadcrumbData = [
    { label: 'Home', href: ADMIN_DASHBOARD },
    { label: 'Media', href: ADMIN_MEDIA_SHOW },
    { label: 'Edit Media', href: "" },
]

const EditMediaPage = () => {
    const { id } = useParams()
    const { data: mediaData } = useFetch(`/api/media/get/${id}`)
    const [loading, setLoading] = useState(false);

    const formSchema = zSchema.pick({
        _id: true,
        alt: true,
        title: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: "",
            alt: "",
            title: ""
        },
    })

    useEffect(() => {
        if (mediaData && mediaData.success) {
            const data = mediaData.data;
            form.reset({
                _id: data._id,
                alt: data.alt,
                title: data.title,
            })
        }
    }, [mediaData])

    const onSubmit = async (values) => {
        try {
            setLoading(true)
            const { data: mediaResponse } = await axios.put('/api/media/update', values)
            if (!mediaResponse.success) {
                throw new Error(mediaResponse.message)
            }
            showToast('success', mediaResponse.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-2 px-3 border-b [.border-b]:pb-2'>
                    <h4 className='font-semibold text-xl uppercase'>Edit Media</h4>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='mb-5'>
                                <Image
                                    src={mediaData?.data?.secure_url || '/assets/images/img-placeholder.webp'}
                                    height={200}
                                    width={200}
                                    alt={mediaData?.data?.alt || 'Image'}
                                />
                            </div>

                            {/* Alt */}
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="alt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alt</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Enter Alt" {...field} />
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
                                                <Input type="text" placeholder="Enter Title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='mb-3'>
                                <ButtonLoading type="submit" text="Update Media" loading={loading} className="cursor-pointer" />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditMediaPage