'use client'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { BsChatQuote } from "react-icons/bs";
import { IoStar } from "react-icons/io5";
import React from 'react'
import Slider from "react-slick";

const Testimonial = () => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    dots: true,
                    infinite: true,
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    dots: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]
    };
    const testimonials = [
        {
            name: "Rohit Sharma",
            review: "Amazing service and great product quality. I was very satisfied with the overall experience. Highly recommend it to anyone looking for reliability and value.",
            rating: 5
        },
        {
            name: "Priya Verma",
            review: "The customer support team was extremely helpful throughout the process. Delivery was fast, and the packaging was excellent. I would definitely order again.",
            rating: 4
        },
        {
            name: "Aman Gupta",
            review: "The product exceeded my expectations in terms of build quality. Everything was as described on the website. Very happy with my purchase.",
            rating: 5
        },
        {
            name: "Sonal Raj",
            review: "A very smooth and user-friendly shopping experience. The website is easy to navigate, and the checkout process was quick and simple. Good job!",
            rating: 4
        },
        {
            name: "Karan Singh",
            review: "I had a small issue with my order, but the support team resolved it quickly. Impressed by the professionalism and response time. Great service overall.",
            rating: 5
        },
        {
            name: "Megha Kapoor",
            review: "The quality of the product is top-notch. I have been using it for a few weeks, and it works exactly as promised. Worth every penny!",
            rating: 5
        },
        {
            name: "Vikas Yadav",
            review: "Good experience overall, though delivery could have been a little faster. But the product was perfect and worked as expected. Satisfied with the purchase.",
            rating: 4
        },
        {
            name: "Nidhi Arora",
            review: "The design and finish of the product really stood out. It feels premium and durable. I’m really glad I chose this over other options available.",
            rating: 5
        },
        {
            name: "Harsh Mehta",
            review: "Excellent platform with a wide range of products. The pricing is fair, and the quality is impressive. Definitely coming back for more purchases.",
            rating: 5
        },
        {
            name: "Simran Kaur",
            review: "From ordering to delivery, everything was seamless. The product was delivered safely and matched the description perfectly. Very satisfied!",
            rating: 4
        }
    ];

    return (
        <Slider {...settings}>
            {testimonials.map((item, index) => (
                <div key={index} className="p-5">
                    <div className="border rounded-lg p-5">
                        <BsChatQuote size={30} className="mb-3" />
                        <p className="mb-5">{item.review}</p>
                        <h4 className="font-semibold">{item.name}</h4>
                        <div className="flex mt-1">
                            {Array.from({ length: item.rating }).map((_, i) => (
                                <IoStar key={i} className="text-yellow-400" size={20} />
                            ))}
                        </div>
                    </div>
                </div>

            ))}

        </Slider>
    )
}

export default Testimonial