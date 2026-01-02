import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { IoFilter } from "react-icons/io5";
import React from 'react'
import { sortingOptions } from "@/lib/utils"

const Sorting = ({ limit, setLimit, sorting, setSorting, mobileFilterOpen, setMobileFilterOpen }) => {
    return (
        <div className='flex justify-between items-center flex-wrap gap-2 p-4 bg-gray-50'>
            <Button type="button" variant="outline" className="lg:hidden" onClick={() => setMobileFilterOpen(!mobileFilterOpen)}><IoFilter />Filter</Button>
            <ul className='flex items-center gap-4'>
                <li className='font-semibold'>Show</li>
                {[9, 12, 18, 24].map(num => (
                    <li key={num}>
                        <button type='button' className={`${limit === num ? 'w-8 h-8 flex justify-center items-center rounded-full bg-primary text-white' : ''}`} onClick={() => setLimit(num)}>
                            {num}
                        </button>
                    </li>
                ))}
            </ul>
            <Select value={sorting} onValueChange={(value) => setSorting(value)} >
                <SelectTrigger className='md:w-[180px] w-full bg-white'>
                    <SelectValue placeholder="Default Sorting" />
                </SelectTrigger>
                <SelectContent>
                    {sortingOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default Sorting