import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

const LatestOrder = () => {
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
                {Array.from({ length: 20 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>INV00{index + 1}</TableCell>
                        <TableCell>PAY00{index + 1}</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>pending</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LatestOrder