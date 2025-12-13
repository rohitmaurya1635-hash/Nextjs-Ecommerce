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
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes'

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
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>T-shirt</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Hoodies</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Oversized</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Full Sleeves</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Polo</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className='text-xl font-bold uppercase mb-5'>Userfull Links</h4>
                    <ul>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Home</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Shop</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>About</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Register</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Login</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className='text-xl font-bold uppercase mb-5'>Help Center</h4>
                    <ul>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Register</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Login</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>My Account</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Privacy Policy</Link></li>
                        <li className='mb-2 text-gray-500 hover:text-primary'><Link href={"#"}>Terms & Conditions</Link></li>
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
                            <Link className="hover:text-primary text-sm" href="tel:+91-8968641825">+91-8968641825</Link>
                        </li>
                        <li className="mb-2 text-gray-500 flex gap-2">
                            <MdOutlineMail size={20} />
                            <a className="hover:text-primary text-sm" href="mailto:rohitmaurya1635@gmail.com">rohitmaurya1635@gmail.com</a>
                        </li>
                    </ul>
                    <div className="flex gap-5 mt-5">
                        <Link href={"#"}><FiYoutube size={25} className="text-primary" /></Link>
                        <Link href={"#"}><RiFacebookCircleLine size={25} className="text-primary" /></Link>
                        <Link href={"#"}><FaInstagram size={25} className="text-primary" /></Link>
                        <Link href={"#"}><FiTwitter size={25} className="text-primary" /></Link>
                        <Link href={"#"}><FaWhatsapp size={25} className="text-primary" /></Link> 
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