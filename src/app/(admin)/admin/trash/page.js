'use client'

import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_DASHBOARD, ADMIN_TRASH } from '@/routes/AdminPanelRoutes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useCallback, useMemo } from 'react'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { Button } from '@/components/ui/button'
import { DT_CATEGORY_COLUMN } from '@/lib/column'
import DataTableWraper from '@/components/Application/Admin/DataTableWraper'
import DeleteAction from '@/components/Application/Admin/DeletedAction'
import EditAction from '@/components/Application/Admin/EditAction'
import { FiPlus } from 'react-icons/fi'
import Link from 'next/link'
import { columnConfig } from '@/lib/helperFunction'
import { useSearchParams } from 'next/navigation'

const breadcrumbData = [
    { label: 'Home', href: ADMIN_DASHBOARD },
    { label: 'Trash', href: "" }
]

const TRASH_CONFIG = {
    category: {
        title: 'Category Trash',
        columns: DT_CATEGORY_COLUMN,
        fetchUrl: '/api/category',
        exportUrl: '/api/category/export',
        deleteUrl: '/api/category/delete',
    }
}

const TrashPage = () => {
    const searchParams = useSearchParams()
    const trashOf = searchParams.get('trashof')

    const config = TRASH_CONFIG[trashOf];


    const columns = useMemo(() => {
        return columnConfig(config.columns, false, false, true )
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key='edit' href={ADMIN_CATEGORY_EDIT(row.original._id)} />)
        //actionMenu.push(<DeleteAction key='delete' deleteType={deleteType} handleDetete={handleDelete} row={row} />)
        return actionMenu
    }, [])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-2 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center'>
                        <h4 className='font-semibold text-xl uppercase'>{config.title}</h4>
                    </div>
                </CardHeader>
                <CardContent className='px-0'>
                    <DataTableWraper
                        queryKey={`${trashOf}-data-deleted`}
                        fetchUrl={config.fetchUrl}
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndPoint={config.exportUrl}
                        deleteEndpoint={config.deleteUrl}
                        deleteType='PD'
                        // trashView={`${ADMIN_TRASH}?trashof=category`} 
                        createActions={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default TrashPage