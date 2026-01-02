import { ListItemIcon, MenuItem } from '@mui/material'

import Link from 'next/link'
import React from 'react'
import { RemoveRedEye } from '@mui/icons-material';

const ViewAction = ({ href }) => {
    return (
        <MenuItem key="view">
            <Link href={href} className='flex'>
                <ListItemIcon>
                    <RemoveRedEye />
                </ListItemIcon>
                View
            </Link>
        </MenuItem>
    )
}

export default ViewAction