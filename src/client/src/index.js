import { createRoot } from "react-dom/client";
import React from 'react';
import './index.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import DiscordAuth from './components/discord-auth';
import NotFound from './components/not-found';
import Home from './components/home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
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
