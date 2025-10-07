'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"

import AppLogo from "../AppLogo"
import { Button } from "@/components/ui/button"
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import React from 'react'
import { adminAppSidebarmenu } from "@/lib/adminSidebarMenu";

const AppSidebar = () => {
    const {toggleSidebar} = useSidebar();
    return (
        <Sidebar className="z-50">
            <SidebarHeader className="border-b h-14 p-0">
                <div className="flex justify-between items-center px-4">
                    <AppLogo />

                    <Button onClick={toggleSidebar} type="button" size="icon" className="md:hidden">
                        <IoMdClose />
                    </Button>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-3">
                <SidebarMenu>
                    {adminAppSidebarmenu.map((menu, index) => (
                        <Collapsible key={index}>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton asChild className="font-semibold px-2 py-5">
                                        <Link href={menu?.url}>
                                            <menu.icon />
                                            {menu.title}

                                            {menu.submenu && menu.submenu.length > 0 &&
                                                <LuChevronRight className="ml-auto transition-transform duration-200 group-data[state=open]/collapsible:rotate-90" />
                                            }
                                        </Link>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                {menu.submenu && menu.submenu.length > 0 &&
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {menu.submenu.map((submenuItem, submenuIndex) => (
                                                <SidebarMenuSubItem key={submenuIndex}>
                                                    <SidebarMenuSubButton asChild className="px-2 py-5">
                                                        <Link href={submenuItem?.url}>
                                                            {submenuItem.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                }
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar >
    )
}

export default AppSidebar