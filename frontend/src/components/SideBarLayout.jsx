import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'
import SideMenu from './SideMenu'
import Header from './Header'
const SideBarLayout = () => {
    const navigate = useNavigate()
    const { isAuthenticated, data, accessToken, loading } = useContext(AuthContext)
    useEffect(() => {
        if (!isAuthenticated && !loading) {
            navigate('/log-in')
        }
    }, [isAuthenticated, loading])

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const closeSidebar = () => {
        setSidebarOpen(false);
    };
    return (
        <div>
            <Header sidebar={sidebarOpen} setSidebar={setSidebarOpen}/>
            {sidebarOpen && <SideMenu onClose={closeSidebar}/>}
            <Outlet context={{data, accessToken, sidebarOpen, loading}} />
        </div>
    )
}

export default SideBarLayout