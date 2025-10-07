import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import React from 'react'

const BreadCrumb = ({ breadcrumbData }) => {
    return (
        <Breadcrumb className="mb-5">
            <BreadcrumbList>
                {breadcrumbData.length > 0 && breadcrumbData.map((data, index) => {
                    return (
                        <React.Fragment key={data.href || index}>
                            {index !== breadcrumbData.length - 1 ? (
                                <>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={data.href}>{data.label}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                </>
                            ) : (
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{data.label}</BreadcrumbPage>
                                </BreadcrumbItem>
                            )}
                        </React.Fragment>
                    )
                })}

            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb