import React from "react"
import UserNavigatinMenu from "./UserNavigatinMenu"
import WebsiteBreadcrumb from "./WebsiteBreadcrumb"

const UserPageWrapper = ({ breadcrumb, children }) => {
    return (
        <>
            {/* Breadcrumb */}
            <WebsiteBreadcrumb props={breadcrumb} />

            {/* Layout */}
            <div className='flex lg:flex-nowrap flex-wrap gap-10 lg:px-32 px-5 my-20'>
                <div className='lg:w-64 w-full lg:mb-0 mb-5'>
                    <UserNavigatinMenu />
                </div>
                <div className='lg:w-[calc(100%-16rem)] w-full'>
                    {children}
                </div>
            </div>
        </>
    )
}

export default UserPageWrapper
