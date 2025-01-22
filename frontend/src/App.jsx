import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateRoom from './pages/CreateRoom';
import History from './pages/History';
import JoinRoom from './pages/JoinRoom';
import Room from './pages/Room';
import Game from './components/Game';

// Layout with Navbar & Footer (Only for Dashboard)
const MainLayout = () => (
  <>
    <ToastContainer
      position="top-center"
      autoClose={1500}
      limit={2}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="light"
    />
    <div className="!w-full h-full">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  </>
);

// Layout without Navbar & Footer (For Home, Login, Register)
const NoNavLayout = () => (
  <>
    <ToastContainer
      position="top-center"
      autoClose={1500}
      limit={2}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="light"
    />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <NoNavLayout />, // Home, Login, and Register won't have Navbar/Footer
    children: [
      { path: '/', element: <Home /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
    ],
  },
  {
    path: '/dashboard',
    element: <MainLayout />, 
    children: [
      { path: '', element: <CreateRoom /> },  
      { path: 'create-room', element: <CreateRoom /> },  
      { path: 'history', element: <History /> },  
      { path: 'join-room', element: <JoinRoom /> },  
      { path: 'room/:roomId', element: <Room /> },  
      {path:"game/:roomId" ,element: <Game /> },  
    ],
  },
]);

const App = () => (
  <AnimatePresence>
    <div className="h-full w-full bg-[#E6E6FA]">
      <RouterProvider router={router} />
    </div>
  </AnimatePresence>
);

export default App;
