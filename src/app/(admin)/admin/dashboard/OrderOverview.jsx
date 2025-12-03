"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import React from 'react'

const chartData = [
    { month: "January", amount: 186 },
    { month: "February", amount: 305 },
    { month: "March", amount: 237 },
    { month: "April", amount: 73 },
    { month: "May", amount: 209 },
    { month: "June", amount: 214 },
    { month: "July", amount: 300 },
    { month: "August", amount: 180 },
    { month: "September", amount: 50 },
    { month: "October", amount: 150 },
    { month: "November", amount: 170 },
    { month: "December", amount: 90 },
]

const chartConfig = {
    amount: {
        label: "Amount",
        color: "#8e51ff",
    },
}

const OrderOverview = () => {
    return (
        <div>
            <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="amount" fill="var(--color-amount)" radius={5} />
                </BarChart>
            </ChartContainer>
        </div>
    )
}

export default OrderOverview
