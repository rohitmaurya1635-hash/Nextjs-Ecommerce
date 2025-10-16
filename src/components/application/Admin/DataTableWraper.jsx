'use client'

import React, { useEffect, useState } from 'react'
import { darkTheme, lightTheme } from '@/lib/materialTheme'

import Datatable from './Datatable'
import { ThemeProvider } from '@mui/material'
import { useTheme } from 'next-themes'

const DataTableWraper = ({
    queryKey,
    fetchUrl,
    columnsConfig,
    initialPageSize = 10,
    exportEndPoint,
    deleteEndpoint,
    deleteType,
    trashView,
    createActions
}) => {
    const { resolvedTheme } = useTheme();

    const [mounted, setMounted] = useState(null)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <ThemeProvider theme={resolvedTheme === 'dark' ? darkTheme : lightTheme} >
            <Datatable
                queryKey={queryKey}
                fetchUrl={fetchUrl}
                columnsConfig={columnsConfig}
                initialPageSize={initialPageSize}
                exportEndPoint={exportEndPoint}
                deleteEndpoint={deleteEndpoint}
                deleteType={deleteType}
                trashView={trashView}
                createActions={createActions}
            />
        </ThemeProvider>
    )
}

export default DataTableWraper