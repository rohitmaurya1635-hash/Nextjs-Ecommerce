import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { ADMIN_MEDIA_EDIT } from '@/routes/AdminPanelRoutes';
import { BsThreeDotsVertical } from "react-icons/bs";
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { IoIosLink } from 'react-icons/io';
import Link from 'next/link';
import { LuTrash } from 'react-icons/lu';
import { MdOutlineEdit } from 'react-icons/md';
import React from 'react'
import { showToast } from '@/lib/showToast';

export const Media = ({ media, handleDelete, deletetype, selectedMedia, setSelectedMedia }) => {
    const handleCheck = () => {
        let newSelectedMedia = []
        if (selectedMedia.includes(media._id)) {
            newSelectedMedia = selectedMedia.filter(m => m !== media._id);
        } else {
            newSelectedMedia = [...selectedMedia, media._id]
        }
        setSelectedMedia(newSelectedMedia)
    }

    const handleCopyLink = async (url) => {
        await navigator.clipboard.writeText(url)
        showToast('success', 'Link copied.')
    }

    return (
        <div className='border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden'>
            <div className='absolute top-2 left-2 z-20'>
                <Checkbox
                    checked={selectedMedia.includes(media._id)}
                    onCheckedChange={handleCheck}
                    className='border-primary cursor-pointer'
                />
            </div>

            <div className='absolute top-2 right-2 z-20'>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <span className='w-7 h-7 flex items-center justify-center rounded-full bg-black/50 cursor-pointer'>
                            <BsThreeDotsVertical color='#fff' />
                        </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        {deletetype === 'SD' &&
                            <>
                                <DropdownMenuItem asChild className='cursor-pointer'>
                                    <Link href={ADMIN_MEDIA_EDIT(media._id)}><MdOutlineEdit />Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCopyLink(media.secure_url)} className='cursor-pointer'>
                                    <IoIosLink />
                                    Copy Link
                                </DropdownMenuItem>
                            </>
                        }
                        <DropdownMenuItem onClick={() => { handleDelete([media._id], deletetype) }} className='cursor-pointer'>
                            <LuTrash color='red' />
                            {deletetype === 'SD' ? 'Move Into Trash' : 'Delete Permanently'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className='w-full h-full absolute z-10 transition-all duration-150 ease-in group-hover:bg-black/30'>

            </div>

            <div>
                <Image
                    src={media?.secure_url}
                    alt={media?.alt || 'Image'}
                    height={300}
                    width={200}
                    className='object-cover w-full sm:h-[200px] h-[150px]'
                />
            </div>
        </div>
    )
}
