/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import {
    collection, query, getFirestore, where, getDocs,
    doc, deleteDoc,
} from 'firebase/firestore';
import { distanceBetween, geohashQueryBounds, Geopoint } from 'geofire-common';
import { useDebouncedCallback } from 'use-debounce';
import Geocode from 'react-geocode';
import { k_admin_facility_page_route, k_facility_page_route } from '../index';
import { GOOGLE_GEOCODING_API_KEY, GOOGLE_MAPS_API_KEY } from '../api';
import { checkedIfAllowedOnPage, k_admin_role, k_regular_user_role } from '../authredirect/auth-check';
import firebaseApp from '../firebase';
import { setupAuthListener } from '../authredirect/setup-auth-listener';
import styles from './styles.module.css';
import Navbar from '../navbar';

const render = (status: Status) => <h1>{status}</h1>;

const MapPage = () => {
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    const navigate = useNavigate();
    const { search } = useLocation();
    const [hasParsedQueryParams, setHasParsedQueryParams] = useState<boolean>(false);
    const [center, setCenter] = useState<any>([33.78010647946605, -84.38955018824828]);
    const [zoom, setZoom] = useState<number>(16.0);
    const [radius, setRadius] = useState<number>(444);
    const [facilities, setFacilities] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [locationInput, setLocationInput] = useState<string>('930 Spring St NW, Atlanta, GA 30309');
    const [isUnknownLocation, setIsUnknownLocation] = useState<boolean>(false);

    // use query parameter to set the center location of the map (if they are defined)
    const setLocationFromQueryParams = () => {
        if (!hasParsedQueryParams) {
            try {
                const searchParams = new URLSearchParams(search);
                const validSearchParams = searchParams.get('lat') && searchParams.get('lon');
                if (validSearchParams) {
                    // set latitude and longitude of marker
                    const lat = parseFloat(searchParams.get('lat') || '33.78010647946605');
                    const lon = parseFloat(searchParams.get('lon') || '-84.38955018824828');
                    setCenter([lat, lon]);

                    // eslint-disable-next-line max-len
                    // set search text of place (query Google Geo Decoding API to get the address of a place from latitude and longitude values)
                    Geocode.setApiKey(GOOGLE_GEOCODING_API_KEY);
                    Geocode.fromLatLng(lat.toString(), lon.toString()).then(
                        (response) => {
                            // eslint-disable-next-line max-len
                            if (response.results && response.results.length > 0 && response.results[0].formatted_address) {
                                setLocationInput(`${response.results[0].formatted_address}`);
                            } else {
                                setLocationInput(`(${lat}, ${lon})`);
                            }
                        },
                        (error) => {
                            setLoading(false);
                            if ((error?.message || '').includes('ZERO_RESULTS') || (error?.message || '').includes('Provided address is invalid')) {
                                setIsUnknownLocation(true);
                            } else {
                                console.error(error);
                            }
                        },
                    );
                }
            } catch (e) {
                console.error('Unable to parse latitude and longitude query parameters');
            }
            setHasParsedQueryParams(true);
        }
    };

    const queryLocations = async () => {
        // setFacilities([]);
        if (db) {
            const c = center as Geopoint;
            const radiusInM = radius;
            const bounds = geohashQueryBounds(c, radiusInM);
            const newFacilities: any = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const b of bounds) {
                const lowerPointHash = b[1];
                const upperPointHash = b[0];
                const documentGeohashField = 'geohash';
                const q = query(collection(db, 'facility'), where(documentGeohashField, '>=', upperPointHash), where(documentGeohashField, '<=', lowerPointHash));
                // eslint-disable-next-line no-await-in-loop
                const querySnapshot = await getDocs(q);
                // eslint-disable-next-line @typescript-eslint/no-shadow
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
                const keyA = a.distance; const
                    keyB = b.distance;
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
            setFacilities(newFacilities);
        }
    };

    // rate limit the frequency at which we query for nearby facilities
    const debounced = useDebouncedCallback(
        () => {
            setLoading(true);
            queryLocations().then(() => {
                setLoading(false);
            });
        },
        500,
    );

    // redirect user if not allowed on page
    useEffect(() => {
        checkedIfAllowedOnPage(auth, navigate, [k_regular_user_role, k_admin_role]);
        setupAuthListener(auth, navigate, true, false);
    }, [auth, navigate]);

    // request for new list of facilities nearby location
    useEffect(() => {
        // search facilities when center or radius is updated
        setLoading(true);
        debounced();
    }, [center, radius, debounced]);

    // check if admin (to allow them to delete facilities)
    useEffect(() => {
        auth.onAuthStateChanged((user: any) => {
            if (user) {
                user.getIdTokenResult()
                    .then((idTokenResult: any) => {
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        const isAdmin = idTokenResult?.claims?.admin === true;
                        setIsAdmin(isAdmin);
                    });
            }
        });
    }, [auth]);

    // rate limit the frequency at which we query search input
    const debouncedSearchInput = useDebouncedCallback(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        (locationInput) => {
            setLoading(true);
            Geocode.setApiKey(GOOGLE_GEOCODING_API_KEY);
            Geocode.fromAddress(locationInput || '').then(
                (response) => {
                    setIsUnknownLocation(false);
                    setLoading(false);
                    const { lat, lng } = response.results[0].geometry.location;
                    setCenter([lat, lng]);
                    setLocationFromQueryParams();
                },
                (error) => {
                    setLoading(false);
                    if ((error?.message || '').includes('ZERO_RESULTS') || (error?.message || '').includes('Provided address is invalid')) {
                        setIsUnknownLocation(true);
                    } else {
                        console.error(error);
                    }
                },
            );
        },
        1000,
    );

    useEffect(() => {
        debouncedSearchInput(locationInput);
    }, [locationInput, debouncedSearchInput]);

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.innerContainer}>
                {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
                <FacilityList
                    facilities={facilities}
                    center={center}
                    radius={radius}
                    setRadius={setRadius}
                    loading={loading}
                    isAdmin={isAdmin}
                    locationInput={locationInput}
                    setLocationInput={setLocationInput}
                    isUnknownLocation={isUnknownLocation}
                />
                <div className={styles.mapView}>
                    <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render}>
                        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
                        <MapComponent
                            center={center}
                            setCenter={setCenter}
                            zoom={zoom}
                            setZoom={setZoom}
                            radius={radius}
                            setRadius={setRadius}
                        >
                            {
                                facilities.map((facility: any, index: number) => (
                                    // eslint-disable-next-line max-len
                                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                                    <Marker
                                        key={facility?.id || index}
                                        position={{
                                            lat: facility?.geopoint?.latitude || 0.0,
                                            lng: facility?.geopoint?.longitude || 0.0,
                                        }}
                                        label={{ color: 'black', text: facility?.name || 'No name' }}
                                        title={facility?.id}
                                    />
                                ))
                            }
                            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
                            <Marker
                                key="user"
                                position={{
                                    lat: center[0],
                                    lng: center[1],
                                }}
                                label={{ color: 'black', text: 'You' }}
                            />
                            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
                            <Circle
                                center={{
                                    lat: center[0],
                                    lng: center[1],
                                }}
                                radius={radius}
                                fillColor="rgba(237,199,255,0.45)"
                                strokeColor="rgba(153,79,169,0.71)"
                            />
                        </MapComponent>
                    </Wrapper>
                </div>
            </div>
        </div>
    );
};

const FacilityList = (props: any) => {
    const db = getFirestore(firebaseApp);
    const navigate = useNavigate();

    function getMiles(meters: number): number {
        return meters * 0.000621371192;
    }

    return (
        <div className={styles.listView}>
            {
                // eslint-disable-next-line react/destructuring-assignment
                props.isAdmin
                && (
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                    <div
                        className={styles.backBtnContainer}
                        onClick={() => {
                            navigate(k_admin_facility_page_route);
                        }}
                    >
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M27 20H13"
                                stroke="#5C5C5C"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M20 27L13 20L20 13"
                                stroke="#5C5C5C"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className={styles.backBtnText}>Back</div>
                    </div>
                )
            }
            <div className={styles.filterContainer}>
                <div className={styles.filterHeader}>Location</div>
                <div className={styles.searchContainer}>
                    <input
                        className={styles.searchLocation}
                        value={props.locationInput}
                        onChange={(event) => {
                            props.setLocationInput(event.target.value);
                        }}
                    />
                </div>
                <div className={styles.filterHeader}>Max Distance</div>
                <div className={styles.distanceSliderContainer}>
                    <div>
                        {parseFloat(getMiles(props.radius).toString()).toFixed(2)}
                        {' '}
                        miles
                    </div>
                    <input
                        type="range"
                        min={160}
                        max={10099}
                        value={props.radius}
                        className="slider"
                        onChange={(event) => {
                            props.setRadius(parseFloat(event.target.value));
                        }}
                    />
                </div>
            </div>
            {
                props.isUnknownLocation
                && <div className={styles.invalidLocationText}>Unlabeled location</div>
            }
            {
                !props.isUnknownLocation
                && (
                    <div className={styles.listOuterContainer}>
                        {
                            props?.loading ? (
                                <div className="loader" />
                            ) : (
                                <div className={styles.listInnerContainer}>
                                    {/* eslint-disable-next-line max-len */}
                                    {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                                    {props.facilities.map((facility: any, index: number) => {
                                        // eslint-disable-next-line max-len
                                        const distanceInMeters = Math.round(distanceBetween(props?.center || [0, 0], [facility?.geopoint?.latitude || 0.0, facility?.geopoint?.longitude || 0.0]) * 1000.0);
                                        const distance = getMiles(distanceInMeters);
                                        return (
                                            // eslint-disable-next-line max-len
                                            <div key={facility.id} className={styles.listItemContainer}>
                                                <div className={styles.listItemText}>{`NAME: ${facility.name}`}</div>
                                                <div className={styles.listItemText}>ADDRESS:</div>
                                                <div className={styles.listItemText}>{`${facility.address}`}</div>
                                                <div className={styles.listItemText}>{`PHONE: ${facility.phone}`}</div>
                                                <div
                                                    className={styles.listItemText}
                                                >
                                                    {`DISTANCE: ${parseFloat(distance.toString()).toFixed(2)} miles away`}
                                                </div>
                                                <div className={styles.listItemButtonsContainer}>
                                                    {
                                                        props.isAdmin
                                                    && (
                                                        <button
                                                            className={styles.secondaryBtnListView}
                                                            onClick={() => {
                                                                // eslint-disable-next-line max-len
                                                                // eslint-disable-next-line no-restricted-globals
                                                                if (confirm(`Delete ${facility.name} facility?`)) {
                                                                    deleteDoc(doc(db, 'facility', facility.id || '')).then(() => {
                                                                        window.location.reload();
                                                                    }).catch((error: any) => {
                                                                        alert('Error deleting facility.');
                                                                        console.error('Error deleting facility', error);
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    )
                                                    }
                                                    <button
                                                        className={styles.primaryBtnListView}
                                                        onClick={() => {
                                                            navigate(`${k_facility_page_route}/${facility.id}` || 'none', { state: { distance, fromPage: 'map' } });
                                                        }}
                                                    >
                                                        More Info
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
};

interface MapComponentProps {
    center: any,
    // eslint-disable-next-line react/no-unused-prop-types
    setCenter: Function,
    radius: number,
    // eslint-disable-next-line react/no-unused-prop-types
    setRadius: Function,
    zoom: number,
    // eslint-disable-next-line react/no-unused-prop-types
    setZoom: Function,
    children: any
}

const MapComponent = (props: MapComponentProps) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();

    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {
                // eslint-disable-next-line react/destructuring-assignment
                center: new google.maps.LatLng(props.center[0], props.center[1]),
                // eslint-disable-next-line react/destructuring-assignment
                zoom: props.zoom,
            }));
        }
        // eslint-disable-next-line react/destructuring-assignment
    }, [ref, map, props.radius, props.center, props.zoom]);

    useEffect(() => {
        if (map) {
            map.panTo({
                // eslint-disable-next-line react/destructuring-assignment
                lat: props.center[0] || 0.0,
                // eslint-disable-next-line react/destructuring-assignment
                lng: props.center[1] || 0.0,
            });
            map.setZoom(16.0);
        }
        // eslint-disable-next-line react/destructuring-assignment
    }, [map, props.center]);

    return (
        // <div ref={ref} style={{width: '100%', height: '100%'}} {...props}/>
        <>
            <div ref={ref} style={{ width: '100%', height: '100%' }} />
            {/* eslint-disable-next-line consistent-return,react/destructuring-assignment */}
            {React.Children.map(props.children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    // @ts-ignore
                    return React.cloneElement(child, { map });
                }
            })}
        </>
    );
};

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
    const [marker, setMarker] = React.useState<google.maps.Marker>();
    const navigate = useNavigate();

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
            marker.addListener('click', () => {
                const facilityID = marker?.getTitle();
                if (facilityID) {
                    navigate(`${k_facility_page_route}/${facilityID}`);
                }
            });
        }
    }, [marker, options, navigate]);

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
