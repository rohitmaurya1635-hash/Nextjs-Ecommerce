'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect, useState } from 'react'

import ButtonLoading from '@/components/Application/ButtonLoading'
import Dropzone from 'react-dropzone'
import { FaCamera } from 'react-icons/fa6'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import UserPageWrapper from '@/components/Application/Website/UserPageWrapper'
import axios from 'axios'
import { login } from '@/store/reducer/authReducer'
import { showToast } from '@/lib/showToast'
import { useDispatch } from 'react-redux'
import useFetch from '@/hooks/useFetch'
import { useForm } from 'react-hook-form'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const breadcrumb = {
    title: 'Profile',
    links: [{ label: 'Profile' }]
}
const UserProfilePage = () => {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState('')
    const [preview, setPreview] = useState('')
    const dispatch = useDispatch()

    const { data: user } = useFetch('/api/dashboard/user/profile')

    const formSchema = zSchema.pick({
        name: true,
        phone: true,
        address: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
        },
    })

    useEffect(() => {
        if (user && user.success) {
            form.reset({
                name: user?.data?.name,
                phone: user?.data?.phone,
                address: user?.data?.address,
            })
            setPreview(user?.data?.avatar?.url)
        }
    }, [user])

    const onSubmit = async (values) => {
        try {
            setLoading(true)
            let formData = new FormData()
            if (file) {
                formData.set('file', file)
            }
            formData.set('name', values.name)
            formData.set('phone', values.phone)
            formData.set('address', values.address)

            const { data: updateResponse } = await axios.put('/api/dashboard/user/update', formData)
            if (!updateResponse.success) {
                throw new Error(updateResponse.message)
            }
            showToast('success', updateResponse.message)
            dispatch(login(updateResponse.data))
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    const handelFileSelection = (files) => {
        const file = files[0]
        const previw = URL.createObjectURL(file)
        setPreview(previw)
        setFile(file)
    }

    return (
        <UserPageWrapper breadcrumb={breadcrumb}>
            <div className='shadow rounded'>
                <div className='p-5 text-xl font-semibold border'>My Profile</div>

                <div className='p-5'>
                    <Form {...form}>
                        <form className='grid md:grid-cols-2 grid-cols-1 gap-5' onSubmit={form.handleSubmit(onSubmit)}>

                            <div className='md:col-span-2 col-span-1 flex justify-center items-center'>
                                <Dropzone onDrop={acceptedFiles => handelFileSelection(acceptedFiles)}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <Avatar className='size-28 relative group border border-gray-200'>
                                                    <AvatarImage src={preview ? preview : '/assets/images/user.png'} />
                                                    <div className='absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center bg-black/20 border-2 border-violet-500 rounded-full group-hover:flex hidden cursor-pointer'>
                                                        <FaCamera size={20} color='#7c3aed' />
                                                    </div>
                                                </Avatar>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </div>

                            {/* Name */}
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="Enter Your name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Phone number */}
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Enter Your Phone number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Phone number */}
                            <div className='mb-3 md:col-span-2 col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter Your Address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='mb-3 md:col-span-2 col-span-1'>
                                <ButtonLoading type="submit" text="Update Profile" loading={loading} className="cursor-pointer" />
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </UserPageWrapper>
    )
}

export default UserProfilePage