'use client'

import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoutes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useEffect, useState } from 'react'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import Editor from '@/components/Application/Admin/Editor'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import MediaModal from '@/components/Application/Admin/MediaModal'
import Select from '@/components/Application/Select'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import slugify from 'slugify'
import useFetch from '@/hooks/useFetch'
import { useForm } from 'react-hook-form'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const breadcrumbData = [
    { label: 'Home', href: ADMIN_DASHBOARD },
    { label: 'Products', href: ADMIN_PRODUCT_SHOW },
    { label: 'Add Product', href: "" },
]
const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [categoryOption, setCategoryOption] = useState([])
    const { data: getCategory } = useFetch('/api/category?deleteType=SD&size=10000')

    // media model states
    const [open, setOpen] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState([])

    useEffect(() => {
        if (getCategory && getCategory.success) {
            const data = getCategory.data
            const options = data.map((cat) => ({ label: cat.name, value: cat._id }))
            setCategoryOption(options);
        }
    }, [getCategory])

    const formSchema = zSchema.pick({
        name: true,
        slug: true,
        category: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        description: true,
    }).refine(
        (data) => data.sellingPrice <= data.mrp,
        {
            message: "Selling Price must be less than or equal to MRP",
            path: ["sellingPrice"],
        }
    );

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            category: "",
            mrp: 0,
            sellingPrice: 0,
            discountPercentage: 0,
            description: "",
        },
    })
    const onSubmit = async (values) => {
        setLoading(true)
        try {
            if (selectedMedia.length <= 0) {
                return showToast('error', 'Please select media.')
            }

            const mediaIdes = selectedMedia.map(media => media._id)
            values.media = mediaIdes
            const { data: productResponse } = await axios.post('/api/product/create', values)
            if (!productResponse.success) {
                throw new Error(productResponse.message)
            }
            form.reset()
            showToast('success', productResponse.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const name = form.getValues('name')
        if (name) {
            form.setValue('slug', slugify(name, { lower: true, trim: true }))
        }

    }, [form.watch('name')])

    // discount percentage calculation
    useEffect(() => {
        const mrp = form.getValues("mrp")
        const sellingPrice = form.getValues("sellingPrice")
        if (mrp > 0 && sellingPrice > 0) {
            const discountPercentage = ((mrp - sellingPrice) / mrp) * 100
            form.setValue("discountPercentage", isNaN(discountPercentage) || !isFinite(discountPercentage) ? 0 : discountPercentage.toFixed(2))
        }
    }, [form.watch("mrp"), form.watch("sellingPrice")])


    const editor = (event, editor) => {
        const data = editor.getData()
        form.setValue('description', data)
    }


    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-2 px-3 border-b [.border-b]:pb-2'>
                    <h4 className='font-semibold text-xl uppercase'>Add Product</h4>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='grid md:grid-cols-2 gap-5'>

                                {/* Category Name */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Name<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter product name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter slug" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Select
                                                        options={categoryOption}
                                                        selected={field.value ?? null}
                                                        setSelected={field.onChange}
                                                        placeholder='Select Category'
                                                        isMulti={false}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* MRP */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="mrp"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>MRP<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter MRP" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Selling Price */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="sellingPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Selling Price<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter selling price" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Discount Percentage */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="discountPercentage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Discount Percentage<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter Discount percentage" {...field} readOnly />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Description */}
                                <div className='mb-5 md:col-span-2'>
                                    <FormLabel className='mb-2'>Description<span className='text-red-500'>*</span></FormLabel>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <Editor
                                                onChange={editor}
                                                initialData={field.value}
                                            />
                                        )}
                                    />
                                    <FormMessage />
                                </div>
                            </div>

                            <div className='mb-5 md:col-span-2 border border-dashed rounded p-5 text-center'>
                                <MediaModal
                                    open={open}
                                    setOpen={setOpen}
                                    selectedMedia={selectedMedia}
                                    setSelectedMedia={setSelectedMedia}
                                    isMultiple={true}
                                />
                                {selectedMedia.length > 0 &&
                                    <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                                        {selectedMedia.map(media => (
                                            <div className='h-24 w-24 border' key={media._id}>
                                                <Image
                                                    src={media.url}
                                                    width={100}
                                                    height={100}
                                                    alt=''
                                                    className='size-full object-cover'
                                                />
                                            </div>
                                        ))}
                                    </div>
                                }
                                <div onClick={() => setOpen(!open)} className='bg-gray-50 dark:bg-card border w-48 mx-auto p-5 cursor-pointer'>
                                    <span className='font-semibold'>Select Media</span>
                                </div>
                            </div>

                            <div className='mb-3'>
                                <ButtonLoading type="submit" text="Add Product" loading={loading} className="cursor-pointer" />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddProduct