'use client'

import { ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIANT_SHOW } from '@/routes/AdminPanelRoutes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { use, useEffect, useState } from 'react'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import MediaModal from '@/components/Application/Admin/MediaModal'
import Select from '@/components/Application/Select'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { sizes } from '@/lib/utils'
import useFetch from '@/hooks/useFetch'
import { useForm } from 'react-hook-form'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const breadcrumbData = [
    { label: 'Home', href: ADMIN_DASHBOARD },
    { label: 'Product Variants', href: ADMIN_PRODUCT_VARIANT_SHOW },
    { label: 'Edit Product Variant', href: "" },
]
const EditProductVariant = ({ params }) => {
    const { id } = use(params)
    const [loading, setLoading] = useState(false);
    const [productOption, setProductOption] = useState([])
    const { data: getProduct } = useFetch('/api/product?deleteType=SD&size=10000')
    const { data: getProductVariant } = useFetch(`/api/product-variant/get/${id}`)

    // media model states
    const [open, setOpen] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState([])

    useEffect(() => {
        if (getProduct && getProduct.success) {
            const data = getProduct.data
            const options = data.map((product) => ({ label: product.name, value: product._id }))
            setProductOption(options);
        }
    }, [getProduct])

    const formSchema = zSchema.pick({
        _id: true,
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
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
            _id: id,
            product: "",
            sku: "",
            color: "",
            size: "",
            mrp: 0,
            sellingPrice: 0,
            discountPercentage: 0,
        },
    })

    console.log("form errors", form.formState.errors)

    useEffect(() => {
        if (getProductVariant && getProductVariant.success) {
            const productVaiant = getProductVariant.data
            form.reset({
                _id: productVaiant._id,
                product: productVaiant.product,
                sku: productVaiant.sku,
                color: productVaiant.color,
                size: productVaiant.size,
                mrp: productVaiant.mrp,
                sellingPrice: productVaiant.sellingPrice,
                discountPercentage: productVaiant.discountPercentage,
            })
            if (productVaiant.media) {
                console.log(productVaiant.media);
                const media = productVaiant.media.map((media) => ({ _id: media._id, url: media.secure_url }))
                setSelectedMedia(media)
                console.log(selectedMedia);
            }
        }
    }, [getProductVariant])

    const onSubmit = async (values) => {
        
        setLoading(true)
        try {
            if (selectedMedia.length <= 0) {
                return showToast('error', 'Please select media.')
            }

            const mediaIdes = selectedMedia.map(media => media._id)
            values.media = mediaIdes
            const { data: productResponse } = await axios.put('/api/product-variant/update', values)
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

    // discount percentage calculation
    useEffect(() => {
        const mrp = form.getValues("mrp")
        const sellingPrice = form.getValues("sellingPrice")
        if (mrp > 0 && sellingPrice > 0) {
            const discountPercentage = ((mrp - sellingPrice) / mrp) * 100
            form.setValue("discountPercentage", isNaN(discountPercentage) || !isFinite(discountPercentage) ? 0 : discountPercentage.toFixed(2))
        }
    }, [form.watch("mrp"), form.watch("sellingPrice")])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-2 px-3 border-b [.border-b]:pb-2'>
                    <h4 className='font-semibold text-xl uppercase'>Add Product Variant</h4>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='grid md:grid-cols-2 gap-5'>

                                {/* Product Name */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="product"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Select
                                                        options={productOption}
                                                        selected={field.value ?? null}
                                                        setSelected={field.onChange}
                                                        placeholder='Select Product'
                                                        isMulti={false}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* SKU */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="sku"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SKU<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter SKU" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Color */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="color"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Color<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter color" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Size */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="size"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Size<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Select
                                                        options={sizes}
                                                        selected={field.value ?? null}
                                                        setSelected={field.onChange}
                                                        placeholder='Select Size'
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
                                <div className='mb-3'>
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
                                <ButtonLoading type="submit" text="Update Product Variant" loading={loading} className="cursor-pointer" />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditProductVariant