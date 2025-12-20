'use client'

import React from 'react'
import { WEBSITE_CART } from '@/routes/WebsiteRoutes'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { useSelector } from 'react-redux'

const bredcrumbs = {
    title: 'Cart',
    links: [
        { label: 'Cart', href: WEBSITE_CART }
    ]
}

const CartPage = () => {
    const cart = useSelector(store => store.authStore)

    return (
        <div>
            <WebsiteBreadcrumb props={bredcrumbs} />

        </div>
    )
}

export default CartPage