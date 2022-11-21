import React, {useEffect, useState} from 'react';
import Navbar from '../navbar';
import styles from './styles.module.css';
import {getAuth} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {setupAuthListener} from '../authredirect/setup-auth-listener';
import firebaseApp from '../firebase';
import {checkedIfAllowedOnPage, k_admin_role, k_regular_user_role} from '../authredirect/auth-check';
import {Wrapper, Status} from '@googlemaps/react-wrapper';
import {collection, query, getFirestore, where, getDocs} from 'firebase/firestore';
import {GOOGLE_MAPS_API_KEY} from '../api';
import {distanceBetween, geohashQueryBounds, Geopoint} from "geofire-common";
import {useDebouncedCallback} from "use-debounce";
import {k_facility_page_route} from "../index";
import { doc, deleteDoc } from "firebase/firestore";

const render = (status: Status) => {
    return <h1>{status}</h1>;
};

function MapPage() {
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    const navigate = useNavigate();
    const [center, setCenter] = useState<any>([33.78010647946605, -84.38955018824828]);
    const [zoom, setZoom] = useState<number>(16.0);
    const [radius, setRadius] = useState<number>(444);
    const [facilities, setFacilities] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false);

    const queryLocations = async () => {
        // setFacilities([]);
        if (db) {
            const c = center as Geopoint;
            const radiusInM = radius;
            const bounds = geohashQueryBounds(c, radiusInM);
            const newFacilities: any = [];
            for (const b of bounds) {
                const lowerPointHash = b[1];
                const upperPointHash = b[0];
                const documentGeohashField = 'geohash';
                const q = query(collection(db, 'facility'), where(documentGeohashField, '>=', upperPointHash), where(documentGeohashField, '<=', lowerPointHash));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const lat = doc?.data()?.geopoint?.latitude;
                    const lon = doc?.data()?.geopoint?.longitude;
                    if (lat && lon) {
                        // geo hash not 100% accurate, have to double-check distance
                        const distance = distanceBetween([lat, lon] as Geopoint, c) * 1000;
                        if (distance <= radiusInM) {
                            const newFacility: any = doc.data();
                            newFacility.id = doc.id;
                            newFacility.distance = distance;
                            newFacilities.push(newFacility);
                        }
                    }
                });
            }
            newFacilities.sort((a: any, b: any) => {
                let keyA = a.distance, keyB = b.distance;
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
            setFacilities(newFacilities);
            return;
        }
    }

    const debounced = useDebouncedCallback(
        (radius) => {
            setLoading(true);
            queryLocations().then(() => {
                setLoading(false);
            });
        },
        1000
    );

    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_regular_user_role, k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    useEffect(() => {
        // search facilities when center or radius is updated
        setLoading(true);
        debounced(radius);
    }, [center, radius, debounced])

    return (
        <div className={styles.container}>
            <Navbar/>
            {/*TODO: allow admin user to delete facility*/}
            <div className={styles.innerContainer}>
                <FacilityList facilities={facilities} center={center} radius={radius} setRadius={setRadius} loading={loading}/>
                <div className={styles.mapView}>
                    <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render}>
                        <MapComponent center={center} setCenter={setCenter} zoom={zoom} setZoom={setZoom} radius={radius} setRadius={setRadius}>
                            {
                                facilities.map((facility: any, index: number) => {
                                    return (
                                        <Marker
                                            key={facility?.id || index}
                                            position={{
                                                lat: facility?.geopoint?.latitude || 0.0,
                                                lng: facility?.geopoint?.longitude || 0.0,
                                            }}
                                            label={{color: 'black', text: facility?.name || 'No name'}}
                                        />
                                    );
                                })
                            }
                            <Marker
                                key={'user'}
                                position={{
                                    lat: center[0],
                                    lng: center[1],
                                }}
                                label={{color: 'black', text: 'You'}}
                            />
                            <Circle
                                center={{
                                    lat: center[0],
                                    lng: center[1],
                                }}
                                radius={radius}
                                fillColor={'rgba(237,199,255,0.45)'}
                                strokeColor={'rgba(153,79,169,0.71)'}
                            />
                        </MapComponent>
                    </Wrapper>
                </div>
            </div>
        </div>
    );
}

function FacilityList(props: any) {
    const db = getFirestore(firebaseApp);
    const navigate = useNavigate();

    function getMiles(meters: number): number {
        return meters * 0.000621371192;
    }

    return (
        <div className={styles.listView}>
            <div className={styles.filterContainer}>
                <div className={styles.filterHeader}>Location</div>
                <input value={'930 Spring Street NW'} onChange={(event) => {
                    console.log(event.target.value)
                }}/>
                <div className={styles.filterHeader}>Max Distance</div>
                <div className={styles.distanceSliderContainer}>
                    <div>{parseFloat(getMiles(props.radius).toString()).toFixed(2)} miles</div>
                    <input type="range" min={160} max={10099} value={props.radius} className="slider" onChange={(event) => {props.setRadius(parseFloat(event.target.value))}}/>
                </div>
            </div>
            <div className={styles.listOuterContainer}>
                {
                    props?.loading ? (
                        <div className="loader"></div>
                    ) : (
                        <div className={styles.listInnerContainer}>
                            {props.facilities.map((facility: any, index: number) => {
                                const distanceInMeters = Math.round(distanceBetween(props?.center || [0, 0], [facility?.geopoint?.latitude || 0.0, facility?.geopoint?.longitude || 0.0]) * 1000.0);
                                const distance = getMiles(distanceInMeters);
                                return (
                                    <div key={facility.id} className={styles.listItemContainer}>
                                        <div className={styles.listItemText}>{`NAME: ${facility.name}`}</div>
                                        <div className={styles.listItemText}>{`ADDRESS:`}</div>
                                        <div className={styles.listItemText}>{`${facility.address}`}</div>
                                        <div className={styles.listItemText}>{`PHONE: ${facility.phone}`}</div>
                                        <div className={styles.listItemText}>{`DISTANCE: ${parseFloat(distance.toString()).toFixed(2)} miles away`}</div>
                                        <div className={styles.listItemButtonsContainer}>
                                            <button className={styles.secondaryBtnListView} onClick={() => {
                                                // eslint-disable-next-line no-restricted-globals
                                                if (confirm(`Delete ${facility.name} facility?`)) {
                                                    deleteDoc(doc(db, 'facility', facility.id || "")).then(() => {
                                                        window.location.reload();
                                                    }).catch((error: any) => {
                                                        alert("Error deleting facility.");
                                                        console.error("Error deleting facility", error);
                                                    });
                                                }
                                            }}>Delete</button>
                                            <button className={styles.primaryBtnListView} onClick={() => {navigate(k_facility_page_route + '/' + facility.id || 'none')}}>More Info</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

interface MapComponentProps {
    center: any,
    setCenter: Function,
    radius: number,
    setRadius: Function,
    zoom: number,
    setZoom: Function,
    children: any
}

function MapComponent(props: MapComponentProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();

    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {
                center: new google.maps.LatLng(props.center[0], props.center[1]),
                zoom: props.zoom,
            }));
        }
    }, [ref, map, props.radius, props.center, props.zoom]);

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

const Circle: React.FC<google.maps.CircleOptions> = (options) => {
    const [circle, setCircle] = React.useState<google.maps.Circle>();

    React.useEffect(() => {
        if (!circle) {
            setCircle(new google.maps.Circle());
        }

        // remove marker from map on unmount
        return () => {
            if (circle) {
                circle.setMap(null);
            }
        };
    }, [circle]);

    React.useEffect(() => {
        if (circle) {
            circle.setOptions(options);
        }
    }, [circle, options]);

    return null;
};


export default MapPage;
