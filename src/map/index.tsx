import React, {ReactElement, useEffect, useState} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import {getAuth} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {setupAuthListener} from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import {checkedIfAllowedOnPage, k_admin_role, k_regular_user_role} from "../authredirect/auth-check";
import {Wrapper, Status} from "@googlemaps/react-wrapper";

const render = (status: Status) => {
    return <h1>{status}</h1>;
};

function MapPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([{
        id: "bhRZIgLYzeIgv2PD5SEZD",
        name: "Facility A",
        address: "4500 Foo Street",
        phone: "(+1) 208-391-9267",
        distance: "5.3 miles"
    }])

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_regular_user_role, k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    useEffect(() => {

    }, []);

    return (
        <div className={styles.container}>
            <Navbar/>
            {/*TODO: allow admin user to delete facility*/}
            <div className={styles.innerContainer}>
                <div className={styles.listView}>
                    <div>Your Location</div>
                    <input value={'930 Spring Street NW'} onChange={(event) => {
                        console.log(event.target.value)
                    }}/>
                    {facilities.map(function (facility, index) {
                        return (
                            <div key={facility.id}>
                                <div>{`NAME: ${facility.name}`}</div>
                                <div>{`ADDRESS: ${facility.address}`}</div>
                                <div>{`PHONE: ${facility.phone}`}</div>
                                <div>{`DISTANCE: ${facility.distance}`}</div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.mapView}>
                    <Wrapper apiKey={'AIzaSyCpHG9-94DvB3FDFYLX8weS0QgyxNDESiQ'} render={render}>
                        <MapComponent/>
                    </Wrapper>
                </div>
            </div>
        </div>
    );
}

function MapComponent() {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();

    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {
                center: new google.maps.LatLng(-33.91722, 151.23064),
                zoom: 16,
            }));
        }
    }, [ref, map]);

    return (
        <div ref={ref} style={{width: '100%', height: '100%'}}/>
    );
}

export default MapPage;
