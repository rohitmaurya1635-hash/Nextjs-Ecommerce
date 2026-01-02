import Image from 'next/image'
import React from 'react'

const Loading = () => {
    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <Image src='/assets/images/loading.svg' height={80} width={80} alt='Loading...' />
        </div>
    )
}

export default Loading