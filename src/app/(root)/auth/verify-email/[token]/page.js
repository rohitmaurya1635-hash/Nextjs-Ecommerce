'use client'

import { Card, CardContent } from '@/components/ui/card';
import React, { use, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes';
import axios from 'axios'

const EmailVerification = ({ params }) => {
    const { token } = use(params)
    const [isVerified, setIsVerified] = useState(false);
    useEffect(() => {
        const verify = async () => {
            const { data: verificationResponse } = await axios.post('/api/auth/verify-email', { token });

            if (verificationResponse.success) {
                setIsVerified(true);
            }
        }
        if (token) verify()
    }, [])

    return (
        <Card className="w-md">
            <CardContent>
                {isVerified ?
                    <div>
                        <div className='flex items-center justify-center'>
                            <Image src="/assets/images/verified.gif" width={150} height={150} alt="Email Verified" />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold my-5 text-green-500'>Email verified successfully!</h1>
                            <Button asChild>
                                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                            </Button>
                        </div>
                    </div>
                    :
                    <div>
                        <div className='flex items-center justify-center'>
                            <Image src="/assets/images/verification-failed.gif" width={150} height={150} alt="Email Verified" />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold my-5 text-red-500'>Email verification failed!</h1>
                            <Button asChild>
                                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                            </Button>
                        </div>
                    </div>
                }
            </CardContent>
        </Card>
    )
}

export default EmailVerification