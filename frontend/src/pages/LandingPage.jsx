import React, { useEffect } from 'react';
import monepana from '../assets/mone-pana.svg';
import moneybro from '../assets/money-bro.svg';
import moneystress from '../assets/money-stress.svg';
import downfall from '../assets/downfall.svg';
import savings from '../assets/savings.svg'
import track from '../assets/track.svg'
import { Carousel } from "flowbite-react";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const LandingPage = () => {

    return (
            <section className='w-full h-screen min-h-screen flex portrait:flex-col items-center justify-between pt-20'>
                <div className='w-1/3 h-full portrait:w-full flex flex-col items-start justify-start gap-5 lg:p-10 p-5 tracking-wide'>
                    <h3 className='text-3xl font-semibold'>Welcome to</h3>
                    <h1 className='lg:text-6xl text-5xl font-bold text-green-500'>Spendigo</h1>
                    <p className='text-xl font-regular mt-5'>Take control of your finances and say goodbye to financial stress.
                    </p>
                    <p className='text-xl font-regular'>Spendigo helps you track, your spending effortlessly.</p>
                    <p className='text-xl font-regular'>Start tracking expenses now!</p>
                    <Link to={'/user/dashboard'} className="px-16 bg-green-500 text-green-50 font-semibold py-2 my-5 rounded-lg shadow-md flex items-center justify-center gap-3 text-xl active:bg-green-800">
                        <span>Track Expenses</span>
                        <RiMoneyRupeeCircleFill className='text-2xl' />
                    </Link>
                </div>

                <div className="w-2/3 portrait:w-full h-full">
                    <Carousel leftControl='.' rightControl='.' indicators={false} slideInterval={1500}>
                        <img className='w-full h-full object-contain' src={downfall} alt="..." />
                        <img className='w-full h-full object-contain' src={monepana} alt="..." />
                        <img className='w-full h-full object-contain' src={moneystress} alt="..." />
                        <img className='w-full h-full object-contain' src={moneybro} alt="..." />
                        <img className='w-full h-full object-contain' src={savings} alt="..." />
                        <img className='w-full h-full object-contain' src={track} alt="..." />
                    </Carousel>
                </div>
            </section>
    );
};

export default LandingPage;
