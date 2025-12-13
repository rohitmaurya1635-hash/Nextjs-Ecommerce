'use client'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import Image from "next/image";
import React from 'react'
import Slider from "react-slick";

const ArrowNext = (props) => {
    const { className, style, onClick } = props;
    return (
        <button type="button" className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white right-10" onClick={onClick}>
            <LuChevronRight size={25} className="text-gray-600" />
        </button>
    );
}

const ArrowPrev = (props) => {
    const { className, style, onClick } = props;
    return (
        <button type="button" className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white left-10" onClick={onClick}>
            <LuChevronLeft size={25} className="text-gray-600" />
        </button>
    );
}


const MainSlider = () => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        nextArrow: <ArrowNext />,
        prevArrow: <ArrowPrev />,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    dots: false,
                    arrows: false,
                    nextArrow: "",
                    prevArrow: "",
                }
            }
        ]
    };
    return (
        <Slider {...settings}>
            <div>
                <Image src="/assets/images/slider-1.png" width={1920} height={600} alt="Slider 1" />
            </div>
            <div>
                <Image src="/assets/images/slider-2.png" width={1920} height={600} alt="Slider 2" />
            </div>
            <div>
                <Image src="/assets/images/slider-3.png" width={1920} height={600} alt="Slider 3" />
            </div>
            <div>
                <Image src="/assets/images/slider-4.png" width={1920} height={600} alt="Slider 4" />
            </div>
        </Slider>
    )
}

export default MainSlider