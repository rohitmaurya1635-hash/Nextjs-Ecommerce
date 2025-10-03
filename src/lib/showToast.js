import { Bounce, toast } from 'react-toastify';

import React from 'react'

export const showToast = (type, message) => {
    const options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    }

    switch (type) {
        case 'info':
            toast.info(message, options)
            break;
        case 'success':
            toast.success(message, options)
            break;
        case 'warning':
            toast.warn(message, options)
            break;
        case 'error':
            toast.error(message, options)
            break;
        default:
            toast(message, options)
            break;
    }
}