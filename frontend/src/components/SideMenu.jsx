import React, { useContext, useState } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaCalculator } from "react-icons/fa6";
import { ImStatsBars } from "react-icons/im";
import { ThemeContext } from '../contexts/Theme';
import { useNavigate } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import logoName from '../assets/logoName.png'
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
export default function SideMenu({ onClose }) {
    const { darkTheme, toggleTheme } = useContext(ThemeContext)

    const [signOutScreen, setSignOutScreen] = useState(false)
    const navigate = useNavigate()

    const switchPage = (page) => {
        onClose()
        navigate(`/user/${page}`)
    }
    return (
        <>
            <section id="sidebar" className="h-screen lg:min-w-1/5 md:min-w-1/4 portrait:md:min-w-1/3 portrait:min-w-1/2 absolute z-50 top-0 left-0 px-10 py-5 flex flex-col items-center justify-between bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <img src={logoName} alt="" className="lg:h-8 h-6" />
                <div className="w-full h-full flex flex-col items-start py-10">
                    <button onClick={() => switchPage('dashboard')} className="w-full flex items-center justify-start gap-3 text-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 active:bg-gray-100 p-3 rounded-lg"><MdSpaceDashboard className="text-2xl" /><span>Dashboard</span></button>

                    <button onClick={() => switchPage('transactions')} className="w-full flex items-center justify-start gap-3 text-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 active:bg-gray-100 p-3 rounded-lg"><FaMoneyBillTransfer className="text-2xl" /><span>Transactions</span></button>

                    <button onClick={() => switchPage('dashboard')} className="w-full flex items-center justify-start gap-3 text-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 active:bg-gray-100 p-3 rounded-lg"><FaCalculator className="text-xl" /><span>Loan Calculator</span></button>

                    <button onClick={() => switchPage('monthly-stats')} className="w-full flex items-center justify-start gap-3 text-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 active:bg-gray-100 p-3 rounded-lg"><ImStatsBars className="text-2xl" /><span>Monthly Stats</span></button>
                </div>

                <div className="w-full border-t-2 pt-5">

                    <button onClick={() => switchPage('profile')} className="w-full flex items-center justify-start gap-3 text-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 active:bg-gray-100 p-3 rounded-lg"><FaUserCircle className="text-2xl" /><span>Profile</span></button>

                    <button onClick={() => setSignOutScreen(true)} className="w-full flex items-center justify-start gap-3 text-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 active:bg-gray-100 p-3 rounded-lg"><FiLogOut className="text-2xl" /><span>Log Out</span></button>

                    <button onClick={() => {
                        toggleTheme()
                        onClose()
                    }} className="w-full flex items-center justify-start gap-3 text-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 active:bg-gray-100 p-3 rounded-lg">{darkTheme ? <MdLightMode className="text-2xl" /> : <MdDarkMode className="text-2xl" />}<span>{darkTheme ? 'Light' : 'Dark'}</span></button>
                </div>
            </section>

            {signOutScreen && <div className="w-screen h-screen flex items-center justify-center rounded-lg absolute top-1/2 left-1/2 transform
             -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="lg:w-1/3 md:w-1/2 portrait:md:w-2/3 portrait:w-10/12 w-2/3 flex flex-col items-center p-10 rounded-xl bg-white dark:bg-gray-800 gap-10">
                    <h1 className="text-5xl font-bold">Log Out</h1>
                    <p className="text-xl font-medium dark:text-gray-300 text-gray-700">Are you sure you want to log out?</p>
                    <div className="flex items-center justify-center gap-5">
                        <button onClick={() => setSignOutScreen(false)} className="bg-green-500 text-white text-xl px-5 py-2 rounded-lg">Cancel</button>
                        <button onClick={() => {
                            signOut(auth)
                            navigate('/log-in')
                        }} className="bg-red-600 text-white text-xl px-5 py-2 rounded-lg">Log Out</button>
                    </div>
                </div>
            </div>}
        </>

    );
} 