import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import LandingPage from './landing';
import LoginPage from './login';

// define routes
export const k_landing_page_route = '/';
export const k_login_page_route = '/sign-in';
export const k_register_page_route = '/sign-up';

const router = createBrowserRouter([
    {
        path: k_landing_page_route,
        element: <LandingPage/>,
    },
    {
        path: k_login_page_route,
        element: <LoginPage/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

reportWebVitals();
