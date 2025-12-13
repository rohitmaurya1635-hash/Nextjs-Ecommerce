"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import ButtonLoading from "../ButtonLoading"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { WEBSITE_SHOP } from "@/routes/WebsiteRoutes"
import useFetch from '@/hooks/useFetch'

const Filter = () => {
    const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 3000 })
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedColor, setSelectedColor] = useState([])
    const [selectedSize, setSelectedSize] = useState([])

    const searchParams = useSearchParams();
    const router = useRouter();

    const { data: categoryData } = useFetch('/api/category/get-category')
    const { data: colorData } = useFetch('/api/product-variant/color')
    const { data: sizeData } = useFetch('/api/product-variant/sizes')

    const urlsearchParams = new URLSearchParams(searchParams.toString())

    const handlePriceChange = (value) => {
        setPriceFilter({ minPrice: value[0], maxPrice: value[1] })
    }

    const handleCategoryFilter = (categorySlug) => {
        let newSelectedCategories = [...selectedCategories]
        if (newSelectedCategories.includes(categorySlug)) {
            newSelectedCategories = newSelectedCategories.filter(cat => cat !== categorySlug)
        } else {
            newSelectedCategories.push(categorySlug)
        }
        setSelectedCategories(newSelectedCategories)

        newSelectedCategories.length > 0 ? urlsearchParams.set('categories', newSelectedCategories.join(',')) : urlsearchParams.delete('categories')
        router.push(`${WEBSITE_SHOP}?${urlsearchParams.toString()}`)
    }

    const handleColorFilter = (color) => {
        let newSelectedColor = [...selectedColor]
        if (newSelectedColor.includes(color)) {
            newSelectedColor = newSelectedColor.filter(cat => cat !== color)
        } else {
            newSelectedColor.push(color)
        }
        setSelectedColor(newSelectedColor)

        newSelectedColor.length > 0 ? urlsearchParams.set('color', newSelectedColor.join(',')) : urlsearchParams.delete('category')
        router.push(`${WEBSITE_SHOP}?${urlsearchParams.toString()}`)
    }

    const handleSizeFilter = (size) => {
        let newSelectedSize = [...selectedSize]
        if (newSelectedSize.includes(size)) {
            newSelectedSize = newSelectedSize.filter(cat => cat !== size)
        } else {
            newSelectedSize.push(size)
        }
        setSelectedSize(newSelectedSize)

        newSelectedSize.length > 0 ? urlsearchParams.set('size', newSelectedSize.join(',')) : urlsearchParams.delete('category')
        router.push(`${WEBSITE_SHOP}?${urlsearchParams.toString()}`)
    }

    const handlePriceFilter = () => {
        urlsearchParams.set('minPrice', priceFilter.minPrice)
        urlsearchParams.set('maxPrice', priceFilter.maxPrice)
        router.push(`${WEBSITE_SHOP}?${urlsearchParams.toString()}`)
    }

    useEffect(() => {
        searchParams.get('categories') && setSelectedCategories(searchParams.get('categories').split(','))
        searchParams.get('color') && setSelectedColor(searchParams.get('color').split(','))
        searchParams.get('size') && setSelectedSize(searchParams.get('size').split(','))
        setPriceFilter({
            minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
            maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 3000
        });
    }, [searchParams])

    useEffect(() => {
        if (!searchParams.toString()) {
            setPriceFilter({ minPrice: 0, maxPrice: 3000 });
            setSelectedCategories([]);
            setSelectedColor([]);
            setSelectedSize([]);
        }
    }, [searchParams]);

    return (
        <div>
            {searchParams.size > 0 && (
                <Button variant="destructive" className="w-full" asChild>
                    <Link href={WEBSITE_SHOP}>Clear Filter</Link>
                </Button>
            )}
            <Accordion type="multiple" defaultValue={['1', '2', '3', '4']}>
                <AccordionItem value="1">
                    <AccordionTrigger className="uppercase font-semibold hover:no-underline">Category</AccordionTrigger>
                    <AccordionContent>
                        <div className="max-h-48 overflow-auto">
                            <ul>
                                {categoryData && categoryData.success && categoryData.data.map((category) => (
                                    <li key={category._id} className="mb-3">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <Checkbox
                                                onCheckedChange={() => handleCategoryFilter(category.slug)}
                                                checked={selectedCategories.includes(category.slug)}
                                            />
                                            <span>{category.name}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="2">
                    <AccordionTrigger className="uppercase font-semibold hover:no-underline">Color</AccordionTrigger>
                    <AccordionContent>
                        <div className="max-h-48 overflow-auto">
                            <ul>
                                {colorData && colorData.success && colorData.data.map((color) => (
                                    <li key={color} className="mb-3">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <Checkbox
                                                onCheckedChange={() => handleColorFilter(color)}
                                                checked={selectedColor.includes(color)}
                                            />
                                            <span>{color}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="3">
                    <AccordionTrigger className="uppercase font-semibold hover:no-underline">Size</AccordionTrigger>
                    <AccordionContent>
                        <div className="max-h-48 overflow-auto">
                            <ul>
                                {sizeData && sizeData.success && sizeData.data.map((size) => (
                                    <li key={size} className="mb-3">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <Checkbox
                                                onCheckedChange={() => handleSizeFilter(size)}
                                                checked={selectedSize.includes(size)}
                                            />
                                            <span>{size}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="4">
                    <AccordionTrigger className="uppercase font-semibold hover:no-underline">Price</AccordionTrigger>
                    <AccordionContent>
                        <div className="my-3">
                            <Slider defaultValue={[0, 3000]} max={3000} step={1} onValueChange={handlePriceChange} />
                            <div className="flex justify-between items-center pt-2">
                                <span>{Number(priceFilter.minPrice)?.toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR'
                                })}</span>

                                <span>{Number(priceFilter.maxPrice)?.toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR'
                                })}</span>
                            </div>
                        </div>
                        <ButtonLoading type="button" text="Filter Price" className="rounded-full cursor-pointer" onClick={handlePriceFilter} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default Filter