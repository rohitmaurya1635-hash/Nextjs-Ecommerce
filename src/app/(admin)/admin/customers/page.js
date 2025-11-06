'use client'

import { ADMIN_DASHBOARD, ADMIN_TRASH } from '@/routes/AdminPanelRoutes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useCallback, useMemo } from 'react'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { DT_CUSTOMERS_COLUMN } from '@/lib/column'
import DataTableWraper from '@/components/Application/Admin/DataTableWraper'
import DeleteAction from '@/components/Application/Admin/DeletedAction'
import { columnConfig } from '@/lib/helperFunction'

const breadcrumbData = [
    { label: 'Home', href: ADMIN_DASHBOARD },
    { label: 'Customers', href: "" }
]

const ShowCustomers = () => {
    const columns = useMemo(() => {
        return columnConfig(DT_CUSTOMERS_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        // actionMenu.push(<EditAction key='edit' href={ADMIN_COUPON_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key='delete' deleteType={deleteType} handleDetete={handleDelete} row={row} />)
        return actionMenu
    }, [])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-2 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center'>
                        <h4 className='font-semibold text-xl uppercase'>All Customers</h4>
                    </div>
                </CardHeader>
                <CardContent className='px-0'>
                    <DataTableWraper
                        queryKey='customers-data'
                        fetchUrl='/api/customers'
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndPoint='/api/customers/export'
                        deleteEndpoint='/api/customers/delete'
                        deleteType='SD'
                        trashView={`${ADMIN_TRASH}?trashof=customers`}
                        createActions={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowCustomers