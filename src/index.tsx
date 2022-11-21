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
import MapPage from './map';
import AuthRedirectPage from './authredirect';

// define routes
export const k_root_page_route = '/';
export const k_landing_page_route = '/about';
export const k_login_page_trainee_route = '/sign-in-trainer';
export const k_login_page_facility_route = '/sign-in-facility';
export const k_login_page_admin_route = '/sign-in-admin';
export const k_register_page_trainee_route = '/sign-up-trainer';
export const k_map_page_route = '/facility-map';

const router = createBrowserRouter([
    {
        path: k_root_page_route,
        element: <AuthRedirectPage/>,
    },
    {
        path: k_landing_page_route,
        element: <LandingPage/>,
    },
    {
        path: k_login_page_trainee_route,
        element: <LoginPage/>,
    },
    {
        path: k_login_page_facility_route,
        element: <LoginPage/>,
    },
    {
        path: k_login_page_admin_route,
        element: <LoginPage/>,
    },
    {
        path: k_register_page_trainee_route,
        element: <RegisterPage/>,
    },
    {
        path: k_map_page_route,
        element: <MapPage/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

reportWebVitals();
