import React, {useEffect, useState} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import {getAuth} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {setupAuthListener} from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import {checkedIfAllowedOnPage, k_admin_role, k_regular_user_role} from "../authredirect/auth-check";
import {Wrapper, Status} from "@googlemaps/react-wrapper";
import {GOOGLE_MAPS_API_KEY} from "../api";

const render = (status: Status) => {
    return <h1>{status}</h1>;
};

function MapPage() {
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [facilities, setFacilities] = useState([{
        id: "bhRZIgLYzeIgv2PD5SEZD",
        name: "Facility A",
        address: "4500 Foo Street",
        phone: "(+1) 208-391-9267",
        distance: "5.3 miles",
        geo: {
            lat: 33.78010647946605,
            lng: -84.38955018824828
        }
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
                <FacilityList facilities={facilities}/>
                <div className={styles.mapView}>
                    <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render}>
                        <MapComponent>
                            {
                                facilities.map((facility, index) => {
                                    return (
                                        <Marker
                                            key={facility?.id || index}
                                            position={{
                                                lat: facility?.geo?.lat || 0.0,
                                                lng: facility?.geo?.lng || 0.0,
                                            }}
                                            label={facility?.name || 'No name'}
                                        />
                                    );
                                })
                            }
                        </MapComponent>
                    </Wrapper>
                </div>
            </div>
        </div>
    );
}

function FacilityList(props: any) {
    return (
        <div className={styles.listView}>
            <div>Your Location</div>
            <input value={'930 Spring Street NW'} onChange={(event) => {
                console.log(event.target.value)
            }}/>
            {props.facilities.map((facility: any, index: number) => {
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
    );
}

interface MapComponentProps {
    children: any
}

function MapComponent(props: MapComponentProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();

    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {
                center: new google.maps.LatLng(33.78010647946605, -84.38955018824828),
                zoom: 16,
            }));
        }
    }, [ref, map]);

    return (
        // <div ref={ref} style={{width: '100%', height: '100%'}} {...props}/>
        <>
            <div ref={ref} style={{width: '100%', height: '100%'}}/>
            {React.Children.map(props.children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    // @ts-ignore
                    return React.cloneElement(child, {map});
                }
            })}
        </>
    );
}

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
    const [marker, setMarker] = React.useState<google.maps.Marker>();

    React.useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker());
        }

        // remove marker from map on unmount
        return () => {
            if (marker) {
                marker.setMap(null);
            }
        };
    }, [marker]);

    React.useEffect(() => {
        if (marker) {
            marker.setOptions(options);
        }
    }, [marker, options]);

    return null;
};


export default MapPage;
