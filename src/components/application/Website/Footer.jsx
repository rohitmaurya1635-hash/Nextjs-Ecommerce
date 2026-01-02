import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_SHOP } from '@/routes/WebsiteRoutes'

import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import { FiYoutube } from "react-icons/fi";
import Image from 'next/image'
import { IoLocationOutline } from "react-icons/io5";
import Link from 'next/link'
import { MdOutlineMail } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import React from 'react'
import { RiFacebookCircleLine } from "react-icons/ri";

const Footer = () => {
    return (
        <div className='bg-gray-50 border-t'>
            <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4'>
                <div className='lg:col-span-1 md:col-end-2 col-span-1'>
                    <Link href={WEBSITE_HOME}>
                        <Image
                            src="/assets/images/logo-black.png"
                            width={383}
                            height={146}
                            alt="logo"
                            className="w-36 mb-2"
                        />
                    </Link>
                    <p className='text-gray-500 text-sm'>
                        E-store is your trusted destination for quality and convenience. From fashion to essentials, we bring everything you need right to your doorstep. Shop smart, live better — only at E-store.
                    </p>
                </div>

                <div>
                    <h4 className='text-xl font-bold uppercase mb-5'>Categories</h4>
                    <ul>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"/shop?categories=t-shirts"}>T-shirt</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"/shop?categories=hoodies"}>Hoodies</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"/shop?categories=oversized"}>Oversized</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"/shop?categories=full-sleeves"}>Full Sleeves</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"/shop?categories=polo"}>Polo</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className='text-xl font-bold uppercase mb-5'>Userfull Links</h4>
                    <ul>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={WEBSITE_HOME}>Home</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={WEBSITE_SHOP}>Shop</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"/about-us"}>About</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={WEBSITE_REGISTER}>Register</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={WEBSITE_LOGIN}>Login</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className='text-xl font-bold uppercase mb-5'>Help Center</h4>
                    <ul>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={WEBSITE_REGISTER}>Register</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={WEBSITE_LOGIN}>Login</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={USER_DASHBOARD}>My Account</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"/privacy-policy"}>Privacy Policy</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"/terms-and-conditions"}>Terms & Conditions</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className='text-xl font-bold uppercase mb-5'>Contact Us</h4>
                    <ul>
                        <li className="mb-2 text-gray-500 flex gap-2">
                            <IoLocationOutline size={20} />
                            <span className="text-sm">E-store market Ludhiana, India 141003</span>
                        </li>
                        <li className="mb-2 text-gray-500 flex gap-2">
                            <MdOutlinePhone size={20} />
                            <a href="tel:+91-8968641825" className="hover:text-primary text-sm">+91-8968641825</a>
                        </li>
                        <li className="mb-2 text-gray-500 flex gap-2">
                            <MdOutlineMail size={20} />
                            <a href="mailto:rohitmaurya1635@gmail.com" className="hover:text-primary text-sm">rohitmaurya1635@gmail.com</a>
                        </li>
                    </ul>
                    <div className="flex gap-5 mt-5">
                        <Link href={"https://www.youtube.com/"}><FiYoutube size={25} className="text-primary" /></Link>
                        <Link href={"https://www.facebook.com/"}><RiFacebookCircleLine size={25} className="text-primary" /></Link>
                        <Link href={"https://www.instagram.com/maurya_1635/"}><FaInstagram size={25} className="text-primary" /></Link>
                        <Link href={"https://x.com/"}><FiTwitter size={25} className="text-primary" /></Link>
                        <Link href={"https://web.whatsapp.com/"}><FaWhatsapp size={25} className="text-primary" /></Link>
                    </div>
                </div>
            </div>

            <div className="py-5 bg-gray-100">
                <p className="text-center">© 2024 Estore. All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer