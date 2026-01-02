'use client'

import { ADMIN_DASHBOARD, ADMIN_ORDERS_DETAILS, ADMIN_TRASH } from '@/routes/AdminPanelRoutes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useCallback, useMemo } from 'react'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { DT_ORDER_COLUMN } from '@/lib/column'
import DataTableWraper from '@/components/Application/Admin/DataTableWraper'
import DeleteAction from '@/components/Application/Admin/DeletedAction'
import ViewAction from '@/components/Application/Admin/ViewAction'
import { columnConfig } from '@/lib/helperFunction'

const breadcrumbData = [
    { label: 'Home', href: ADMIN_DASHBOARD },
    { label: 'Orders', href: "" }
]

const ShowOrder = () => {
    const columns = useMemo(() => {
        return columnConfig(DT_ORDER_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<ViewAction key='view' href={ADMIN_ORDERS_DETAILS(row.original.order_id)} />)
        actionMenu.push(<DeleteAction key='delete' deleteType={deleteType} handleDetete={handleDelete} row={row} />)
        return actionMenu
    }, [])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-2 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center'>
                        <h4 className='font-semibold text-xl uppercase'>All Orders</h4>
                    </div>
                </CardHeader>
                <CardContent className='px-0'>
                    <DataTableWraper
                        queryKey='orders-data'
                        fetchUrl='/api/orders'
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndPoint='/api/orders/export'
                        deleteEndpoint='/api/orders/delete'
                        deleteType='SD'
                        trashView={`${ADMIN_TRASH}?trashof=orders`}
                        createActions={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowOrder