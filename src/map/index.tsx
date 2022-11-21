import React, {ReactElement, useEffect, useState} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import {getAuth} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {setupAuthListener} from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import {checkedIfAllowedOnPage, k_admin_role, k_regular_user_role} from "../authredirect/auth-check";
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";

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
                    <input value={'930 Spring Street NW'} onChange={(event) => {console.log(event.target.value)}}/>
                    {facilities.map(function(facility, index){
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
                    <MapComponent/>
                </div>
            </div>
        </div>
    );
}

function MapComponent() {
    const initialMarkers = [
        {
            position: {
                lat: 33.78004405646938,
                lng: -84.38951800174077
            },
            label: { color: "white", text: "P1" },
            draggable: false
        },
        {
            position: {
                lat: 33.8004405646938,
                lng: -84.38951800174077
            },
            label: { color: "red", text: "P2" },
            draggable: false
        },
    ];

    const [activeInfoWindow, setActiveInfoWindow] = useState("");
    const [markers, setMarkers] = useState(initialMarkers);

    const containerStyle = {
        width: "100%",
        height: "100%",
    }

    const center = {
        lat: 33.78004405646938,
        lng: -84.38951800174077,
    }

    const mapClicked = (event: any) => {
        console.log(event.latLng.lat(), event.latLng.lng())
    }

    const markerClicked = (marker: any, index: any) => {
        setActiveInfoWindow(index)
        console.log(marker, index)
    }

    const markerDragEnd = (event: any, index: any) => {
        console.log(event.latLng.lat())
        console.log(event.latLng.lng())
    }

    return (
        <LoadScript googleMapsApiKey='AIzaSyCpHG9-94DvB3FDFYLX8weS0QgyxNDESiQ'>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onClick={mapClicked}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={marker.position}
                        label={marker.label}
                        draggable={marker.draggable}
                        onDragEnd={event => markerDragEnd(event, index)}
                        onClick={event => markerClicked(marker, index)}
                    >
                        {
                            (activeInfoWindow === index.toString())
                            &&
                            <InfoWindow position={marker.position}>
                                <b>{marker.position.lat}, {marker.position.lng}</b>
                            </InfoWindow>
                        }
                    </Marker>
                ))}
            </GoogleMap>
        </LoadScript>
    );
}

export default MapPage;
