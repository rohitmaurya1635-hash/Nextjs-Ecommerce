'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { useEffect, useState } from "react"

import Image from "next/image"
import { statusBadge } from "@/lib/helperFunction"
import useFetch from "@/hooks/useFetch"

const LatestOrder = () => {
    const [latestOrders, setLatestOrders] = useState()
    const { data, laoding } = useFetch('/api/dashboard/admin/latest-orders')
    useEffect(() => {
        if (data && data.success) {
            setLatestOrders(data.data)
        }
    }, [data])

    if (laoding) return <div className="h-full w-full flex justify-center items-center">Loading...</div>

    if (!latestOrders || latestOrders.length === 0) return <div className="h-full w-full flex justify-center items-center">
        <Image src={'/assets/images/not-found.png'} height={100} width={100} alt="Not fount" className="w-20" />
    </div>


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {latestOrders?.map((order) => (
                    <TableRow key={order._id}>
                        <TableCell>{order._id}</TableCell>
                        <TableCell>{order.payment_id}</TableCell>
                        <TableCell>{order.products.length}</TableCell>
                        <TableCell>{statusBadge(order.orderStatus)}</TableCell>
                        <TableCell className="text-right">{order.grandTotal}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LatestOrder