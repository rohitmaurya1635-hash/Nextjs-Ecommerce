import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Chip } from "@mui/material";
import { useInitials } from "@/hooks/use-initials";

export const DT_CATEGORY_COLUMN = [
    {
        accessorKey: 'name',
        header: 'Category Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },

]

export const DT_PRODUCT_COLUMN = [
    {
        accessorKey: 'name',
        header: 'Product Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        accessorKey: 'mrp',
        header: 'MRP',
    },
    {
        accessorKey: 'sellingPrice',
        header: 'Selling Price',
    },
    {
        accessorKey: 'discountPercentage',
        header: 'Discount %',
    },

]

export const DT_PRODUCT_VARIANT_COLUMN = [
    {
        accessorKey: 'product',
        header: 'Product Name',
    },
    {
        accessorKey: 'color',
        header: 'Color',
    },
    {
        accessorKey: 'size',
        header: 'Size',
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
    },
    {
        accessorKey: 'mrp',
        header: 'MRP',
    },
    {
        accessorKey: 'sellingPrice',
        header: 'Selling Price',
    },
    {
        accessorKey: 'discountPercentage',
        header: 'Discount %',
    },

]

export const DT_COUPON_COLUMN = [
    {
        accessorKey: 'code',
        header: 'Coupon Code',
    },
    {
        accessorKey: 'discountPercentage',
        header: 'Discount %',
    },
    {
        accessorKey: 'minShoppingAmount',
        header: 'Min Shopping Amount',
    },
    {
        accessorKey: 'validity',
        header: 'Validity',
        Cell: ({ renderedCellValue }) => {
            const isExpired = new Date() > new Date(renderedCellValue);
            const formattedDate = new Date(renderedCellValue).toLocaleDateString();
            return (
                <Chip
                    label={`${isExpired ? 'Expired' : 'Active'} (${formattedDate})`}
                    color={isExpired ? 'error' : 'success'}
                    variant="outlined"
                />
            );
        }
    }
]

export const DT_CUSTOMERS_COLUMN = [
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        Cell: ({ row }) => {
            const getInitials = useInitials();
            const avatar = row.original.avatar;
            const name = row.original.name;

            return (
                <Avatar>
                    <AvatarImage src={avatar?.url} alt={name} />
                    <AvatarFallback>
                        {getInitials(name)}
                    </AvatarFallback>
                </Avatar>
            );
        }
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
        accessorKey: 'isEmailVerified',
        header: 'Is Verified',
        Cell: ({ renderedCellValue }) => {
            return (
                <Chip
                    label={`${renderedCellValue ? 'Verified' : 'Not  Verified'}`}
                    color={renderedCellValue ? 'success' : 'error'}
                    variant="outlined"
                />
            );
        }
    },

]

export const DT_REVIEW_COLUMN = [
    {
        accessorKey: 'product',
        header: 'Product',
    },
    {
        accessorKey: 'user',
        header: 'User',
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'rating',
        header: 'Rating',
    },
    {
        accessorKey: 'review',
        header: 'Review',
    },
]

export const DT_ORDER_COLUMN = [
    {
        accessorKey: 'order_id',
        header: 'Order Id',
    },
    {
        accessorKey: 'payment_id',
        header: 'Payment Id',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'country',
        header: 'Country',
    },
    {
        accessorKey: 'state',
        header: 'State',
    },
    {
        accessorKey: 'city',
        header: 'City',
    },
    {
        accessorKey: 'pincode',
        header: 'Pincode',
    },
    {
        accessorKey: 'products',
        header: 'Total Item',
        Cell: ({ renderedCellValue }) => (<span>{renderedCellValue?.length || 0}</span>)
    },
    {
        accessorKey: 'subtotal',
        header: 'Subtotal',
    },
    {
        accessorKey: 'discount',
        header: 'Discount',
        Cell: ({ renderedCellValue }) => (<span>{Math.floor(renderedCellValue, 2) || 0}</span>)
    },
    {
        accessorKey: 'total',
        header: 'Total',
    },
    {
        accessorKey: 'couponDiscountAmount',
        header: 'Coupon Discount',
    },
    {
        accessorKey: 'grandTotal',
        header: 'Grand Total',
    },

]