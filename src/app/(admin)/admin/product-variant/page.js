'use client'

import { ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIANT_ADD, ADMIN_PRODUCT_VARIANT_EDIT, ADMIN_TRASH } from '@/routes/AdminPanelRoutes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useCallback, useMemo } from 'react'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { Button } from '@/components/ui/button'
import { DT_PRODUCT_VARIANT_COLUMN } from '@/lib/column'
import DataTableWraper from '@/components/Application/Admin/DataTableWraper'
import DeleteAction from '@/components/Application/Admin/DeletedAction'
import EditAction from '@/components/Application/Admin/EditAction'
import { FiPlus } from 'react-icons/fi'
import Link from 'next/link'
import { columnConfig } from '@/lib/helperFunction'

const breadcrumbData = [
    { label: 'Home', href: ADMIN_DASHBOARD },
    { label: 'Product Variant', href: "" }
]

const ShowProductVariant = () => {
    const columns = useMemo(() => {
        return columnConfig(DT_PRODUCT_VARIANT_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key='edit' href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key='delete' deleteType={deleteType} handleDetete={handleDelete} row={row} />)
        return actionMenu
    }, [])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-2 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center'>
                        <h4 className='font-semibold text-xl uppercase'>All Product Variants</h4>
                        <Button asChild>
                            <Link href={ADMIN_PRODUCT_VARIANT_ADD}><FiPlus /> New Product Variant</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className='px-0'>
                    <DataTableWraper
                        queryKey='product-variant-data'
                        fetchUrl='/api/product-variant'
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndPoint='/api/product-variant/export'
                        deleteEndpoint='/api/product-variant/delete'
                        deleteType='SD'
                        trashView={`${ADMIN_TRASH}?trashof=product-variant`}
                        createActions={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowProductVariant