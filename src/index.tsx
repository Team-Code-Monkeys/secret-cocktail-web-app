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
import FacilityPage from './facility';
import ReportFacilityCorrectionPage from './facilityreport';
import AdminPortalPage from './adminportal';
import {API_URL} from "./api";

// define routes
export const k_root_page_route = '/';
export const k_landing_page_route = '/about';
export const k_login_page_trainee_route = '/sign-in-trainer';
export const k_login_page_facility_route = '/sign-in-facility';
export const k_login_page_admin_route = '/sign-in-admin';
export const k_register_page_trainee_route = '/sign-up-trainer';
export const k_map_page_route = '/facility-map';
export const k_facility_page_route = '/facility';
export const k_facility_report_correction_page_route = '/facility-report-correction';
export const k_admin_portal_page_route = '/admin-portal';

// TODO: remove this once verified for production and dev
console.log('API_URL:', API_URL);

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
    {
        path: k_facility_page_route,
        element: <FacilityPage/>,
    },
    {
        path: k_facility_page_route + '/:id',
        element: <FacilityPage/>,
    },
    {
        path: k_facility_report_correction_page_route,
        element: <ReportFacilityCorrectionPage/>,
    },
    {
        path: k_admin_portal_page_route,
        element: <AdminPortalPage/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

reportWebVitals();
