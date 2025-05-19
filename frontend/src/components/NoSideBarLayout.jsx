import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
const NoSideBarLayout = () => {
    return (
        <div className='w-screen min-h-screen'>
            <NavBar/>
            <Outlet />
        </div>
    )
}

export default NoSideBarLayout