import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Sale from "./pages/Sale";

import Category from "./pages/Category";
import Item from "./pages/Item";
import SignUp from "./pages/SignUp";
import Stock from "./pages/Stock";
import Layout from "./Layout/Layout";
import SingleInvoice from "./pages/SingleInvoice";



const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />} >
          <Route element={<ProtectedRoute />}>

            <Route index path="/home" element={<Home />} />
            <Route path={"/sales"} element={<Sale />} />
            <Route path={"/categories"} element={<Category />} />
            <Route path={"/items"} element={<Item />} />
            <Route path={"/stocks"} element={<Stock />} />
            <Route path="/invoices/:refNo" element={<SingleInvoice/>}/>
          </Route>

          <Route path={"/auth/signup"} element={<SignUp />} />
          <Route path={"/auth/login"} element={<Login />} />
        </Route>
      </>

    )

  )
  return (

    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App