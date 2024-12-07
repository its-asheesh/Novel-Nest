import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import AllBooks from './pages/AllBooks';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import AllOrders from "./pages/AllOrders";
import SetUserDetails from './pages/SetUserDetails';
import ViewBooksDetails from './components/ViewBooksDetails/ViewBooksDetails';
import Favourites from './components/Profile/Favourites';
import OrderHistory from './components/Profile/UserOrderHistory';
import Settings from './components/Profile/Settings';
import { authActions } from './store/auth';

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (id && token && storedRole) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(storedRole));
    }
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/view-book-details/:id" element={<ViewBooksDetails />} />

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={isLoggedIn ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        >
          <Route path="favourites" element={<Favourites />} />
          <Route path="orderHistory" element={<OrderHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Role-Based Access */}
        {role === 'admin' && (
          <>
            <Route
              path="/admin"
              element={<div>Admin Panel (Replace with actual component)</div>}
            />
            <Route path="/admin/add-book" element={<AddBook />} />
            <Route path="/admin/edit-book/:id" element={<EditBook />} />
            <Route path="/admin/allorders" element={<AllOrders />} /> 
            <Route path="/admin/edit-order/:id" element={<SetUserDetails />} />

          </>
        )}

        {/* Fallback for Undefined Routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
