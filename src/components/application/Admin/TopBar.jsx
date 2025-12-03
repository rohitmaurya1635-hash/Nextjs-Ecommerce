'use client'

import AdminSearch from './AdminSearch';
import { Button } from '@/components/ui/button'
import React from 'react'
import { RiMenu4Fill } from "react-icons/ri";
import ThemeSwitch from './ThemeSwitch'
import UserDropdown from './UserDropdown'
import { useSidebar } from '@/components/ui/sidebar';

export const TopBar = () => {
    const {toggleSidebar} = useSidebar();
    return (
        <div className="fixed border h-14 w-full top-0 left-0 z-30 md:pl-72 md:pr-8 px-5 flex justify-between items-center bg-white dark:bg-card">

            <div>
                <AdminSearch />
            </div>

            <div className="flex items-center gap-2">
                <ThemeSwitch />
                <UserDropdown />
                <Button onClick={toggleSidebar} type="button" size="icon" className="ms-2 md:hidden">
                    <RiMenu4Fill />
                </Button>
            </div>
        </div>
    )
}
