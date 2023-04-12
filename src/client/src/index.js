import { createRoot } from "react-dom/client";
import React from 'react';
import './index.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import DiscordAuth from './elements/discord-auth';
import NotFound from './elements/not-found';
import Admin from './elements/admin';
import Home from './elements/home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/admin',
        element: <Admin/>
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

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
