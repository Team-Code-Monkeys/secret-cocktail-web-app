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
import RegisterPage from './register';

// define routes
export const k_landing_page_route = '/';
export const k_login_page_route_trainee = '/sign-in-trainer';
export const k_login_page_route_facility = '/sign-in-facility';
export const k_login_page_route_admin = '/sign-in-admin';
export const k_register_page_route_trainee = '/sign-up-trainer';

const router = createBrowserRouter([
    {
        path: k_landing_page_route,
        element: <LandingPage/>,
    },
    {
        path: k_login_page_route_trainee,
        element: <LoginPage/>,
    },
    {
        path: k_login_page_route_facility,
        element: <LoginPage/>,
    },
    {
        path: k_login_page_route_admin,
        element: <LoginPage/>,
    },
    {
        path: k_register_page_route_trainee,
        element: <RegisterPage/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

reportWebVitals();
