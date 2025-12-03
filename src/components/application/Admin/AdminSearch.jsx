'use client'

import React, { useState } from 'react'

import { Input } from '@/components/ui/input'
import { IoIosSearch } from "react-icons/io";
import SearchModel from './SearchModel';

const AdminSearch = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className='md:w-[350]'>
            <div className='flex justify-between items-center relative'>
                <Input
                    className="rounded-full cursor-pointer"
                    placeholder="Search..."
                    onClick={() => setOpen(true)}
                    readOnly
                />
                <button type='button' className='absolute right-3 cursor-default'>
                    <IoIosSearch />
                </button>
            </div>

            <SearchModel open={open} setOpen={setOpen} />
        </div>
    )
}

export default AdminSearch