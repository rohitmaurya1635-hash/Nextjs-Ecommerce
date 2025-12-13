import { BsCart2 } from "react-icons/bs";
import React from 'react'

const Cart = () => {
    return (
        <button type='button'>
            <BsCart2 size={25} className="text-gray-600 hover:text-primary cursor-pointer" />
        </button>
    )
}

export default Cart