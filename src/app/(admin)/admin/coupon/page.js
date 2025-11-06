'use client'

import { ADMIN_COUPON_ADD, ADMIN_COUPON_EDIT, ADMIN_DASHBOARD, ADMIN_TRASH } from '@/routes/AdminPanelRoutes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useCallback, useMemo } from 'react'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { Button } from '@/components/ui/button'
import { DT_COUPON_COLUMN } from '@/lib/column'
import DataTableWraper from '@/components/Application/Admin/DataTableWraper'
import DeleteAction from '@/components/Application/Admin/DeletedAction'
import EditAction from '@/components/Application/Admin/EditAction'
import { FiPlus } from 'react-icons/fi'
import Link from 'next/link'
import { columnConfig } from '@/lib/helperFunction'

const breadcrumbData = [
    { label: 'Home', href: ADMIN_DASHBOARD },
    { label: 'Coupons', href: "" }
]

const ShowCoupon = () => {
    const columns = useMemo(() => {
        return columnConfig(DT_COUPON_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key='edit' href={ADMIN_COUPON_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key='delete' deleteType={deleteType} handleDetete={handleDelete} row={row} />)
        return actionMenu
    }, [])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-2 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center'>
                        <h4 className='font-semibold text-xl uppercase'>All Coupons</h4>
                        <Button asChild>
                            <Link href={ADMIN_COUPON_ADD}><FiPlus /> New Coupon</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className='px-0'>
                    <DataTableWraper
                        queryKey='coupon-data'
                        fetchUrl='/api/coupon'
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndPoint='/api/coupon/export'
                        deleteEndpoint='/api/coupon/delete'
                        deleteType='SD'
                        trashView={`${ADMIN_TRASH}?trashof=coupon`}
                        createActions={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowCoupon