import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createRoot } from "react-dom/client";
import React from 'react';
import './css/index.css';

import CreateTicket from './elements/tickets/create-ticket';
import DiscordAuth from './elements/discord-auth';
import Tickets from './elements/tickets/tickets';
import Privileged from './elements/privileged';
import Ticket from './elements/tickets/ticket';
import NotFound from './elements/not-found';
import Account from './elements/account';
import Login from './elements/login';
import Main from './main';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main/>
    },
    {
        path: '/privileged',
        element: <Privileged/>
    },
    {
        path: '/account',
        element: <Account/>
    },
    {
        path: '/tickets',
        element: <Tickets/>
    },
    {
        path: '/tickets/create',
        element: <CreateTicket/>
    },
    {
        path: '/tickets/:ticketID',
        element: <Ticket/>
    },
    {
        path: '/auth/discord',
        element: <DiscordAuth/>
    },
    {
        path: '/auth/login',
        element: <Login/>
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
