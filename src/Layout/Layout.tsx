import { Outlet } from "react-router"
import Navbar from "../components/Navbar"


const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="container p-2 ">
            <Outlet />
            </div>
            
        </>

    )
}

export default Layout