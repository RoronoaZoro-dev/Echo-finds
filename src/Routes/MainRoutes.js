import React from 'react'
import {BrowserRouter as Router , Route} from 'react-router-dom'
import Home from '../Pages/Home'
import Signup from '../Pages/Signup'
import Login from '../Pages/Login'
import CreatePost from '../Pages/CreatePost'
import ViewPost from '../Pages/ViewPost'
import ViewMore from '../Pages/ViewMore'
import SellerSignup from '../Pages/SellerSignup'
import SellerLogin from '../Pages/SellerLogin'
import SellerDashboard from '../Pages/SellerDashboard'
import AddProduct from '../Pages/AddProduct'
import Verification from '../Pages/Verification'
import AdminLogin from '../Pages/AdminLogin'
import AdminDashboard from '../Pages/AdminDashboard'
import SellerVerification from '../Pages/SellerVerification'
import ProductManagement from '../Pages/ProductManagement'
import EcoReports from '../Pages/EcoReports'
import AddSampleProducts from '../Pages/AddSampleProducts'




function MainRoutes() {
    return (
       <Router>
           <Route exact path="/">
               <Home/>
           </Route>
           <Route path="/signup">
               <Signup/>
           </Route>
           <Route path="/login">
               <Login/>
           </Route>
           <Route path="/create">
               <CreatePost/>
           </Route>
           <Route path="/view">
               <ViewPost/>
           </Route>
           <Route path="/viewmore">
               <ViewMore/>
           </Route>
           <Route path="/seller/signup">
               <SellerSignup/>
           </Route>
           <Route path="/seller/login">
               <SellerLogin/>
           </Route>
           <Route path="/seller/dashboard">
               <SellerDashboard/>
           </Route>
           <Route path="/seller/add-product">
               <AddProduct/>
           </Route>
           <Route path="/seller/verification">
               <Verification/>
           </Route>
           <Route path="/admin/login">
               <AdminLogin/>
           </Route>
           <Route path="/admin/dashboard">
               <AdminDashboard/>
           </Route>
           <Route path="/admin/sellers">
               <SellerVerification/>
           </Route>
           <Route path="/admin/products">
               <ProductManagement/>
           </Route>
           <Route path="/admin/reports">
               <EcoReports/>
           </Route>
           <Route path="/add-samples">
               <AddSampleProducts/>
           </Route>
       </Router>
    )
}

export default MainRoutes
