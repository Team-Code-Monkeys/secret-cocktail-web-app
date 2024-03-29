/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Auth } from '@firebase/auth';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { k_root_page_route } from '../index';

export const k_regular_user_role = 'regular';
export const k_admin_role = 'admin';
export const k_facility_role = 'facility';

// eslint-disable-next-line max-len
export const checkedIfAllowedOnPage = (
    auth: Auth,
    navigate: NavigateFunction,
    allowed_roles = [k_regular_user_role, k_admin_role, k_facility_role],
) => {
    if (auth) {
        auth.onAuthStateChanged((user: any) => {
            if (user) {
                user.getIdTokenResult()
                    .then((idTokenResult: any) => {
                        const isAdmin = idTokenResult?.claims?.admin === true;
                        const isFacility = idTokenResult?.claims?.facility === true;
                        const isRegularUser = !isAdmin && !isFacility;
                        // verify user is allowed to view this page
                        if (isAdmin && !allowed_roles.includes(k_admin_role)) {
                            navigate(k_root_page_route);
                            return;
                        }
                        if (isFacility && !allowed_roles.includes(k_facility_role)) {
                            navigate(k_root_page_route);
                            return;
                        }
                        if (isRegularUser && !allowed_roles.includes(k_regular_user_role)) {
                            navigate(k_root_page_route);
                        }
                    })
                    .catch((error: any) => {
                        // eslint-disable-next-line no-console
                        console.log('Error verifying user information', error);
                        // eslint-disable-next-line no-alert
                        alert('Error verifying user information');
                        navigate(k_root_page_route);
                    });
            } else if (!user) {
                navigate(k_root_page_route);
            }
        });
    }
};
