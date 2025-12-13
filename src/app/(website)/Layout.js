import Footer from "@/components/Application/Website/Footer";
import Header from "@/components/Application/Website/Header";
import { Kumbh_Sans } from "next/font/google";
import React from "react";

const kumbh = Kumbh_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
})

const Layout = ({ children }) => {
    return (
        <div className={kumbh.className}>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
