'use client'

import { AiOutlineLogout } from "react-icons/ai";
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import React from 'react'
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes";
import axios from "axios";
import { logout } from "@/store/reducer/authReducer";
import { persistor } from "@/store/store";
import { showToast } from "@/lib/showToast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const { data: logoutResponse } = await axios.post('/api/auth/logout')
            if (!logoutResponse.success) {
                throw new Error(logoutResponse.message)
            }
            dispatch(logout())
            await persistor.purge();
            showToast(logoutResponse.message)
            router.push(WEBSITE_LOGIN)
        } catch (error) {
            showToast('error', error)
        }
    }
    return (
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <AiOutlineLogout color="red" />
            Logout
        </DropdownMenuItem>
    )
}

export default LogoutButton