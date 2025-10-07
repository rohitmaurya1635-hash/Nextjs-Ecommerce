import Image from 'next/image'
import React from 'react'

const AppLogo = () => {
    return (
        <>
            <Image src='/assets/images/logo-black.png' width={50} height={50} className='block dark:hidden h-12 w-auto' alt="Logo dark" />
            <Image src='/assets/images/logo-white.png' width={50} height={50} className='hidden dark:block h-12 w-auto' alt="Logo White" />
        </>
    )
}

export default AppLogo