import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


const Navbar = () => {
    const { isAuthenticated, logout } = useAuth()
    return (
        <nav className="p-4 flex flex-row items-center justify-between border-b-2">

            <div className="flex flex-row items-center justify-center gap-4">

                <div>
                    <h3 className="font-semibold text-3xl">PosSystem </h3>
                </div>
                {isAuthenticated &&
                    <div className="flex flex-row text-slate-800 items-center justify-between gap-2 font-medium">
                        <NavLink className="hover:text-slate-600 hover:border-b-2 p-2 hover:border-b-slate-600" to={"/sales"}> Sales</NavLink>
                        <NavLink className="hover:text-slate-600 hover:border-b-2 p-2 hover:border-b-slate-600" to={"/stocks"}>Stocks</NavLink>
                        <NavLink className="hover:text-slate-600 hover:border-b-2 p-2 hover:border-b-slate-600" to={"/items"}>Items</NavLink>
                        <NavLink className="hover:text-slate-600 hover:border-b-2 p-2 hover:border-b-slate-600" to={"/categories"}>Categories</NavLink>
                    </div>
                }
            </div>



            <div className="flex flex-row items-center justify-between">
                {isAuthenticated ? (<button onClick={logout} className="p-2 hover:bg-slate-600 hover:text-white bg-slate-300 font-semibold rounded-md">Logout</button>) : (
                    <>
                       <Link className="font-medium m-2 p-2 hover:underline" to={"auth/login"}> Login</Link>
                        <Link className="font-medium m-2 p-2 hover:underline" to={"auth/signup"}>Signup</Link>
                    </>
                )}

            </div>
        </nav>
    )
}

export default Navbar