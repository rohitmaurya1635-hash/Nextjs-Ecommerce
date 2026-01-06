import Footer from "@/components/Application/Website/Footer";
import Header from "@/components/Application/Website/Header";
import { Kumbh_Sans } from "next/font/google";

const kumbh = Kumbh_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

export default function WebsiteLayout({ children }) {
    return (
        <div className={kumbh.className}>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
