import * as React from "react";
import * as ReactDom from "react-dom";
import './App.css';
import './map.css';

import { Wrapper, Status } from "@googlemaps/react-wrapper";
// import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import GoogleMapReact from 'google-map-react'
import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'
import PinIcon from '@mui/icons-material/PinDropRounded';
import Spinner from '@mui/material/CircularProgress';

import DeviceList from "./DeviceList";
import History from "./History";
import * as NET from "./net_const";
import * as KEYS from "./keys";

// DEFAULT CENTER: ADC HQ
const DEFAULT_LOC = {
    lat: 38.92290882822017,
    lng: -77.23150329426245,
}

const LocationPin = ({ text }) => (
    <div className="pin">
        <PinIcon icon={locationIcon} className="pin-icon" />
        <p className="pin-text">{text}</p>
    </div>
)

const Map = ({ location, zoomLevel, devices, firstLoad }) => {
    const [map, setMap] = React.useState();
    const [maps, setMaps] = React.useState();
    const [isLoaded, setIsMapLoaded] = React.useState();

    console.log("Firstload: ", firstLoad);
    console.log("devices: ", devices);
    console.log("Result of center: ", firstLoad && devices && devices.length ? devices[0] : null);

    return (
        <div className="google-map" style={{ height: "85vh" }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: KEYS.API_KEY }}
                defaultCenter={DEFAULT_LOC}
                defaultZoom={zoomLevel}
                center={firstLoad && devices && devices.length ? devices[0] : null}
            >
                {
                    devices && devices.map((loc, idx) => {
                        return (
                            <LocationPin
                                lat={loc.lat}
                                lng={loc.lng}
                                text={(idx + 1) + ""}
                                key={idx + ""}
                            />
                        );
                    })
                }
            </GoogleMapReact>
        </div>
    );
}

const MapWrap = (props) => {
    const [devices, setDevices] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [numLoads, setLoaded] = React.useState(0);

    React.useEffect(() => {
        const reqDevices = () => {
            fetch(NET.BASE_API + "/devices")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("Setting loaded to: ", numLoads + 1);
                    setLoaded(numLoads + 1);
                    setDevices(result.devices);
                    setError(null);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setError("Failed to fetch device list");
                }
            )
        };
        reqDevices();
        setInterval(reqDevices, 10000);
    }, [])

    // let centerLoc = numLoads == 1 && devices && devices.length ? devices[0] : null;

    return (
        <div className="map-wrap">
            <DeviceList
                devices={devices}
                error={error}
                {...props}
            />
            <Map location={props.currLoc} zoomLevel={17} devices={devices}
                firstLoad={numLoads == 1}
            />
        </div>
    );
}

const App = () => {
    const [page, setPage] = React.useState("DeviceList");
    const [currDev, setCurrDev] = React.useState();
    const [currLoc, setCurrLoc] = React.useState(null);

    return (<div className="App">
        <div className="header-bar" style={{ zIndex: 100 }}>
            <h2 className="map-h2">Asset Tracker</h2>
        </div>
        {
            page == "DeviceList" ? <MapWrap currLoc={currLoc} setPage={setPage} setDev={setCurrDev} /> : <History device={currDev} setPage={setPage} setDev={setCurrDev} />
        }
    </div>);
}


export default App;