'use client'

import { Avatar, AvatarImage } from "../../ui/avatar";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import React, { useState } from "react";
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from "@/routes/WebsiteRoutes";

import Cart from "./Cart";
import { HiMiniBars3 } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import Search from "./Search";
import { VscAccount } from "react-icons/vsc";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const Header = () => {
    const auth = useSelector(store => store.authStore.auth)
    const pathname = usePathname()
    const [openMenu, setOpenMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const isActive = (href) => {
        if (href === "/") return pathname === "/"
        return pathname.startsWith(href)
    }

    const base = "text-gray-600 hover:text-primary hover:font-semibold transition-colors duration-200"

    const active = "text-primary font-semibold"

    const inactive = "text-gray-600"

    return (
        <div className="bg-white border-b lg:px-32 px-4">
            <div className="flex justify-between items-center lg:py-5 py-3">
                <Link href={WEBSITE_HOME}>
                
                    <Image
                        src="/assets/images/logo-black.png"
                        width={383}
                        height={146}
                        alt="logo"
                        className="lg:w-32 w-24"
                    />
                </Link>

                <div className="flex justify-between gap-20">
                    <nav className={`lg:relative lg:w-auto lg:top-0 lg:h-auto lg:left-0 lg:p-0 bg-white fixed z-50 top-0 w-full h-screen transition-all ${openMenu ? 'left-0' : '-left-full'} `}>
                        <div className="lg:hidden flex justify-between items-center bg-gray-50 py-3 border-b px-4">
                            <Link href={WEBSITE_HOME}>
                                <Image
                                    src="/assets/images/logo-black.png"
                                    width={383}
                                    height={146}
                                    alt="logo"
                                    className="lg:w-32 w-24"
                                />
                            </Link>
                            <button type="button" className="lg:hidden block" onClick={() => setOpenMenu(false)}>
                                <IoMdClose size={25} className="text-gray-600 hover:text-primary cursor-pointer" />
                            </button>

                        </div>
                        <ul className="lg:flex justify-between items-center gap-10 px-3">
                            <li className={`${base} ${isActive(WEBSITE_HOME) ? active : inactive}`}>
                                <Link href={WEBSITE_HOME} className="block py-2" onClick={() => setOpenMenu(false)}>Home</Link>
                            </li>
                            <li className={`${base} ${isActive("/about-us") ? active : inactive}`}>
                                <Link href={"/about-us"} className="block py-2" onClick={() => setOpenMenu(false)}>About</Link>
                            </li>
                            <li className={`${base} ${isActive(WEBSITE_SHOP) ? active : inactive}`}>
                                <Link href={WEBSITE_SHOP} className="block py-2" onClick={() => setOpenMenu(false)}>Shop</Link>
                            </li>
                            <li className={`${base} ${isActive("/shop?categories=t-shirts") ? active : inactive}`}>
                                <Link href={"/shop?categories=t-shirts"} className="block py-2" onClick={() => setOpenMenu(false)}>T-Shirts</Link>
                            </li>
                            <li className={`${base} ${isActive("/shop?categories=oversized") ? active : inactive}`}>
                                <Link href={"/shop?categories=oversized"} className="block py-2" onClick={() => setOpenMenu(false)}>Oversized</Link>
                            </li>
                            <li className={`${base} ${isActive("/shop?categories=hoodies") ? active : inactive}`}>
                                <Link href={"/shop?categories=hoodies"} className="block py-2" onClick={() => setOpenMenu(false)}>Hoodies</Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex justify-between items-center gap-8">
                        <button type="buttton">
                            <IoIosSearch size={25} className="text-gray-600 hover:text-primary cursor-pointer" onClick={() => setShowSearch(!showSearch)} />
                        </button>

                        <Cart />
                        {!auth
                            ?
                            <Link href={WEBSITE_LOGIN}>
                                <VscAccount size={25} className="text-gray-600 hover:text-primary cursor-pointer" />
                            </Link>
                            :
                            <Link href={USER_DASHBOARD}>
                                <Avatar>
                                    <AvatarImage src={auth?.avatar?.url || "/assets/images/user.png"} />
                                </Avatar>
                            </Link>
                        }

                        <button type="button" className="lg:hidden block" onClick={() => setOpenMenu(true)}>
                            <HiMiniBars3 size={25} className="text-gray-600 hover:text-primary cursor-pointer" />
                        </button>

                    </div>
                </div>
            </div>
            <Search isShow={showSearch} />
        </div>
    );
};

export default Header;
