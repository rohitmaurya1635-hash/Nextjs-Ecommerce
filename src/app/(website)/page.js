import { FaShippingFast } from "react-icons/fa";
import FeaturedProducts from "@/components/Application/Website/FeaturedProducts";
import { GiReturnArrow } from "react-icons/gi";
import Image from "next/image";
import Link from "next/link";
import MainSlider from "@/components/Application/Website/MainSlider";
import { MdSupportAgent } from "react-icons/md";
import React from "react";
import { TbDiscountFilled } from "react-icons/tb";
import Testimonial from "@/components/Application/Website/Testimonial";

const HomePage = () => {
	return (
		<>
			<section>
				<MainSlider />
			</section>

			<section className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
				<div className="grid grid-cols-2 sm:gap-10 gap-2">
					<div className="relative w-full h-48 md:h-72 lg:h-96 border rounded-lg overflow-hidden">
						<Link href="" >
							<Image
								src="/assets/images/banner1.png"
								alt="Banner 1"
								fill
								className="object-cover transition-all hover:scale-110"
							/>
						</Link>
					</div>

					<div className="relative w-full h-48 md:h-72 lg:h-96 border rounded-lg overflow-hidden">
						<Link href="">
							<Image
								src="/assets/images/banner2.png"
								alt="Banner 2"
								fill
								className="object-cover transition-all hover:scale-110"
							/>
						</Link>
					</div>
				</div>
			</section>

			<section className="lg:px-32 px-4 sm:py-10">
				<FeaturedProducts />
			</section>

			<section className="sm:pt-20 pt-5 pb-10">
				<Image
					src='/assets/images/advertising-banner.png'
					width={1000}
					height={600}
					alt="Advertising Banner"
					className="w-full"
				/>
			</section>

			<section className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
				<h2 className="text-center sm:text-4xl text-2xl mb-5 font-semibold">Customer Review</h2>
				<Testimonial />
			</section>

			<section className="lg:px-32 px-4 border-t py-10">
				<div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10">
					<div className="text-center">
						<p className="flex justify-center items-center mb-3">
							<GiReturnArrow size={30} />
						</p>
						<h3 className="text-xl font-semibold">7-Days Returns</h3>
						<p>Risk-free shopping with easy returns.</p>
					</div>

					<div className="text-center">
						<p className="flex justify-center items-center mb-3">
							<FaShippingFast size={30} />
						</p>
						<h3 className="text-xl font-semibold">Free Shipping</h3>
						<p>No extra costs, just the price you see.</p>
					</div>

					<div className="text-center">
						<p className="flex justify-center items-center mb-3">
							<MdSupportAgent size={30} />
						</p>
						<h3 className="text-xl font-semibold">24/7 Support</h3>
						<p>24/7 support, alway here just for you.</p>
					</div>

					<div className="text-center">
						<p className="flex justify-center items-center mb-3">
							<TbDiscountFilled size={30} />
						</p>
						<h3 className="text-xl font-semibold">Member Discounts</h3>
						<p>Special offers for our loyal customers.</p>
					</div>
				</div>
			</section>
		</>

	);
};

export default HomePage;
