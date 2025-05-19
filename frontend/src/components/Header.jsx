import React from 'react'
import logoName from '../assets/logoName.png'
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const Header = ({sidebar, setSidebar}) => {
    return (
        <div className='w-screen lg:px-10 py-5 p-5 flex items-center justify-between relative z-50'>
                    <img className='lg:h-8 md:h-7 h-6' src={logoName} alt="" />
                    <button onClick={() => setSidebar(!sidebar)} className='text-2xl active:animate-spin'>{sidebar ? <IoClose className='text-3xl' /> : <HiMenu className='text-3xl' />}</button>
                </div>
    )
}

export default Header