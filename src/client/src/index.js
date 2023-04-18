import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createRoot } from "react-dom/client";
import React from 'react';
import './css/index.css';

import DiscordAuth from './elements/discord-auth';
import Privileged from './elements/privileged';
import NotFound from './elements/not-found';
import Login from './elements/login';
import Home from './elements/home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/privileged',
        element: <Privileged/>
    },
    {
        path: '/auth/discord',
        element: <DiscordAuth/>
    },
    {
        path: '*',
        element: <NotFound/>
    }
]);

createRoot(document.getElementById("root"))
.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
    </React.StrictMode>
);
