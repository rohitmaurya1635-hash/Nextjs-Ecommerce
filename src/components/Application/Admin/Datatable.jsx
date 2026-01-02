import { IconButton, Tooltip } from '@mui/material'
import { MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import React, { useState } from 'react'
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'

import ButtonLoading from '../ButtonLoading';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link'
import RecyclingIcon from '@mui/icons-material/Recycling';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import axios from 'axios'
import { showToast } from '@/lib/showToast';
import useDeleteMutation from '@/hooks/useDeleteMutation';

const Datatable = ({
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

    // fiter sorting and pagination state
    const [columnFilters, setColumnFilters] = useState([])
    const [globalFilter, setGlobalFilter] = useState()
    const [sorting, setSorting] = useState([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: initialPageSize
    })

    // Row selection states
    const [rowSelection, setRowSelection] = useState({})

    // Export data loading state 
    const [exportLoading, setExportLoading] = useState(false)

    const handleExport = async (selectedRows) => {
        setExportLoading(true)
        try {
            const csvConfig = mkConfig({
                fieldSeparator: ',',
                decimalSeparator: '.',
                useKeysAsHeaders: true,
                filename: 'csv-data'
            })

            let csv
            if (Object.keys(rowSelection).length > 0) {
                // export only selected rows 
                const rowData = selectedRows.map((row) => row.origin)
                csv = generateCsv(csvConfig)(rowData)
            } else {
                // export all data
                const { data: response } = await axios.get(exportEndPoint)
                if (!response.success) {
                    throw new Error(response.message)
                }
                const rowData = response.data
                csv = generateCsv(csvConfig)(rowData)
            }
            download(csvConfig)(csv)
            showToast('Export Success')
        } catch (error) {
            showToast(error)
        } finally {
            setExportLoading(false)
        }
    }

    // handle Delete Method
    const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint)
    const handleDelete = (ids, deleteType) => {
        let c
        if (deleteType === 'PD') {
            c = confirm('Are you sure you want to delete data permanently')
        } else {
            c = confirm('Are you sure you want to move data into trash')
        }

        if (c) {
            deleteMutation.mutate({ ids, deleteType })
            setRowSelection({})
        }
    }


    // Data fetching logic 
    const {
        data: { data = [], meta } = {}, //your data and api response will probably be different
        isError,
        isRefetching,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
        queryFn: async () => {
            const fetchURL = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL)
            fetchURL.searchParams.set(
                'start',
                `${pagination.pageIndex * pagination.pageSize}`,
            );
            fetchURL.searchParams.set('size', `${pagination.pageSize}`);
            fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
            fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
            fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));
            fetchURL.searchParams.set('deleteType', deleteType );


            const { data: response } = await axios.get(fetchURL.href)
            return response
        },
        placeholderData: keepPreviousData,
    })

    // init table

    const table = useMaterialReactTable({
        columns: columnsConfig,
        data,
        enableRowSelection:true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        enableColumnOrdering: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        initialState: { showColumnFilters: true },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        rowCount: meta?.totalRowCount ?? 0,
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
            rowSelection
        },
        getRowId: (originRow) => originRow._id,
        renderToolbarInternalActions: ({ table }) => (
            <>
                {/* built inn buttons */}
                <MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ToggleDensePaddingButton table={table} />

                {deleteType !== 'PD' &&
                    <Tooltip title='Recycle Bin'>
                        <Link href={trashView}>
                            <IconButton>
                                <RecyclingIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                }

                {deleteType === 'SD' &&
                    <Tooltip title='Delete All'>
                        <IconButton disabled={!table.getIsSomePageRowsSelected && !table.getIsAllRowsSelected} onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                }

                {deleteType === 'PD' &&
                    <>
                        <Tooltip title='Restore Data'>
                            <IconButton disabled={!table.getIsSomePageRowsSelected && !table.getIsAllRowsSelected}
                                onClick={() => handleDelete(Object.keys(rowSelection), 'RSD')} >
                                <RestoreFromTrashIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title='Delete Permanently'>
                            <IconButton disabled={!table.getIsSomePageRowsSelected && !table.getIsAllRowsSelected}
                                onClick={() => handleDelete(Object.keys(rowSelection), deleteType)} >
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                }
            </>
        ),
        enableRowActions: true,
        positionActionsColumn: 'last',
        renderRowActionMenuItems: ({ row }) => createActions(row, deleteType, handleDelete),
        renderTopToolbarCustomActions: ({ table }) => (
            <Tooltip>
                <ButtonLoading
                    type="button"
                    text={<><SaveAltIcon fontSize='25' /> Export</>}
                    onClick={() => handleExport(table.getSelectedRowModel().rows)}
                    loading={exportLoading}
                    className='cursor-pointer'
                />
            </Tooltip>
        )
    })

    return (
        <MaterialReactTable table={table} />
    )
}

export default Datatable