import AppSidebar from '@/components/Application/Admin/AppSidebar'
import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import ThemeProvider from '@/components/Application/Admin/ThemeProvider'
import { TopBar } from '@/components/Application/Admin/TopBar'

const Layout = ({ children }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar />
                <main className="md:w-[calc(100vw-16rem)]" >
                    <div className='pt-[70px] px-8 min-h-[calc(100vh-40px)] pb-10'>
                        <TopBar />
                        {children}
                    </div>
                    <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm'>
                        © 2025 Nextjs Ecommerce. All Rights Reserved.
                    </div>
                </main>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export default Layout