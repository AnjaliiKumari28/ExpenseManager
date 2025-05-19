import React, { useContext } from 'react'
import { ThemeContext } from '../contexts/Theme';
import logoName from '../assets/logoName.png'
import { MdDarkMode, MdLightMode  } from "react-icons/md";

const NavBar = () => {
    const {darkTheme, toggleTheme} = useContext(ThemeContext)
    return (
        <div className='w-screen lg:px-10 py-5 p-5 flex items-center justify-between absolute top-0 left-0 z-50'>
            <img className='lg:h-8 md:h-7 h-6' src={logoName} alt="" />
            <button onClick={toggleTheme} className='text-2xl active:animate-spin'>{!darkTheme? <MdDarkMode/> : <MdLightMode/>}</button>
        </div>
    )
}

export default NavBar