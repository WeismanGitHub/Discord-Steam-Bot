import { createRoot } from "react-dom/client";
import React from 'react';
import './index.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import DiscordAuth from './components/discord-auth';
import NotFound from './components/not-found';

const router = createBrowserRouter([
    {
        path: '/auth/discord',
        element: <DiscordAuth/>
    },
    {
        path: '*',
        element: <NotFound/>
    }
]);

createRoot(document.getElementById('root')).render(<RouterProvider router={ router }/>)