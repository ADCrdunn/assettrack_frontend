import * as React from "react";
import * as ReactDom from "react-dom";
import './App.css';
import './map.css';
import "./DeviceList.css"

import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'
import * as NET from "./net_const";
import * as KEYS from "./keys";

import GoogleMapReact from 'google-map-react'
import IconButton from '@mui/material/IconButton';
import BackIcon from '@mui/icons-material/ArrowBackRounded';
import PinIcon from '@mui/icons-material/LocationOn';
import Spinner from '@mui/material/CircularProgress';

// DEFAULT CENTER: ADC HQ
const DEFAULT_LOC = {
    lat: 38.92290882822017,
    lng: -77.23150329426245,
}

const NotReadyElm = ({error}) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", height: "100%" }}>
            {
                error == null ? <Spinner /> : <p style={{color: "red"}}>ERROR: {error}</p>
            }
        </div>
    )
}

const LocationRow = (loc) => {

    return (
        <div className="device-row">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p className="device-row-header">{loc.date}</p>
            </div>
            <div className="device-row-body-wrap">
                <div className="device-row-body">
                    <p>Location: {loc.lat}o {loc.lng}</p>
                    <p>Altitude: {loc.alt}</p>
                </div>
            </div>
        </div>
    );
}

const LocationList = ({ device, locs, setPage, error }) => {
    return (
        <div className="device-list">
            <div className="device-row" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => setPage("DeviceList")}>
                    <BackIcon />
                </IconButton>
                <p className="device-row-header">Device {device.id} History</p>
            </div>
            {
                locs == null ? 
                <NotReadyElm error={error}/> :
                locs.map(LocationRow)
            }
        </div>
    )
}

const LocationPin = ({ text }) => (
    <div className="pin">
        <PinIcon icon={locationIcon} className="pin-icon" />
        <p className="pin-text">{text}</p>
    </div>
)

const Map = ({ locations, zoomLevel }) => {
    const [map, setMap] = React.useState();
    const [maps, setMaps] = React.useState();
    const [isLoaded, setIsMapLoaded] = React.useState();
    let origin = null;
    if (locations && locations.length) {
        origin = locations[0]; // set to most recent location
    }
    else 
    {
        origin = DEFAULT_LOC;
    }


    return (
        <div className="google-map" style={{ height: "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: KEYS.API_KEY }}
                center={origin}
                defaultZoom={zoomLevel}
                onGoogleApiLoaded={({ map, maps }) => {
                    setMap(map); setMaps(maps); setIsMapLoaded(true);
                    map.data.add({
                        geometry: new maps.Data.LineString(locations)
                    })
                    map.data.setStyle({
                        strokeColor: '#0000FF',
                        strokeWeight: 1
                    });
                }
                }
            >
                {
                    locations && locations.map((loc, idx) => {
                        let label = idx + 1 < locations.length ? (idx+1) + "" : "Now"
                        return (
                            <LocationPin
                            lat={loc.lat}
                            lng={loc.lng}
                            text={label}
                        />
                        );
                    })
                }
               
            </GoogleMapReact>
        </div>
    );
}

const test_locs = [{ lat: 30, lng: 40, alt: 1, date: new Date() }, { lat: 30.1, lng: 40.3, alt: 2, date: new Date() }, { lat: 30.2, lng: 40.2, alt: 2, date: new Date() }, { lat: 29.3, lng: 40.3, alt: 2, date: new Date() }];
const History = (props) => {
    const [locations, setLocs] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        fetch(NET.BASE_API + "/device/" + props.device.id)
            .then(res => res.json())
            .then(
                (result) => {
                    setLocs(result.locations);
                    setError(null);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setError("Failed to load device location history");
                }
            );
    }, [])

    return (<div className="map-wrap">
        <LocationList
            locs={locations}
            error={error}
            {...props}
        />
        <Map locations={locations} zoomLevel={17} />
    </div>);
}


export default History;