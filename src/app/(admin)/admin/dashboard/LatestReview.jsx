import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import { IoStar } from "react-icons/io5"

const LatestReview = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 20 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell className='flex items-center gap-3'>
                            <Avatar>
                                <AvatarImage src="/assets/images/img-placeholder.webp" alt={"logo"} />
                            </Avatar>
                            <span className="line-clamp-1">Lorem ipsum dolor sit amet.</span>
                        </TableCell>
                        <TableCell>
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, starIndex) => (
                                    <span key={starIndex}>
                                        <IoStar className="text-yellow-500" />
                                    </span>
                                ))}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LatestReview