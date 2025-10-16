import { ListItemIcon, MenuItem } from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react'

const DeleteAction = ({ handleDetete, deleteType, row }) => {
    return (
        <MenuItem key="delete" onClick={() => { handleDetete([row.original._id], deleteType) }}>
            <ListItemIcon>
                <DeleteIcon />
            </ListItemIcon>
            Delete
        </MenuItem>
    )
}

export default DeleteAction