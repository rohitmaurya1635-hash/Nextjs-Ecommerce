import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoutes";

import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoMdStarOutline } from "react-icons/io";
import { IoShirtOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { MdOutlinePermMedia } from "react-icons/md";
import { MdOutlineShoppingBag } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";

export const adminAppSidebarmenu = [
    {
        title: "Dashboard",
        url: ADMIN_DASHBOARD,
        icon: AiOutlineDashboard,
    },
    {
        title: "Category",
        url: "#",
        icon: BiCategory,
        submenu: [
            {
                title: "All Category",
                url: "#",
            },
            {
                title: "Add Category",
                url: "#",
            }
        ]
    },
    {
        title: "Product",
        url: "#",
        icon: IoShirtOutline,
        submenu: [
            {
                title: "Add Product",
                url: "#",
            },
            {
                title: "Add Varient",
                url: "#",
            },
            {
                title: "All Product",
                url: "#",
            },
            {
                title: "Add Varient",
                url: "#",
            },
        ]
    },
    {
        title: "Coupons",
        url: "#",
        icon: RiCoupon2Line,
        submenu: [
            {
                title: "All Coupons",
                url: "#",
            },
            {
                title: "Add Coupons",
                url: "#",
            }
        ]
    },
    {
        title: "Orders",
        url: "#",
        icon: MdOutlineShoppingBag,
    },
    {
        title: "Customers",
        url: "#",
        icon: LuUserRound,
    },
    {
        title: "Raiting & Review",
        url: "#",
        icon: IoMdStarOutline,
    },
    {
        title: "Media",
        url: ADMIN_MEDIA_SHOW,
        icon: MdOutlinePermMedia,
    }
]