import * as React from "react";
import * as ReactDom from "react-dom";
import './App.css';
import './map.css';
import "./DeviceList.css"

import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'

import GoogleMapReact from 'google-map-react'
import IconButton from '@mui/material/IconButton';
import BackIcon from '@mui/icons-material/ArrowBackRounded';
import PinIcon from '@mui/icons-material/PinDropRounded';

const location = {
    address: '1600 Amphitheatre Parkway, Mountain View, california.',
    lat: 37.42216,
    lng: -122.08427,
} // our location object from earlier



const LocationRow = (loc) => {

    return (
        <div className="device-row">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p className="device-row-header">{loc.date.toISOString()}</p>
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

const LocationList = ({ dev, locs, setPage }) => {
    return (
        <div className="device-list">
            <div className="device-row" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => setPage("DeviceList")}>
                    <BackIcon />
                </IconButton>
                <p className="device-row-header">{dev.name} History</p>
            </div>
            {locs.map(LocationRow)}
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


    return (
        <div className="google-map" style={{ height: "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyC7PwKGD84I44L1GdZYO7mCwgeFaiWsEQI' }}
                defaultCenter={origin}
                defaultZoom={zoomLevel}
                onGoogleApiLoaded={({ map, maps }) => {
                    setMap(map); setMaps(maps); setIsMapLoaded(true);
                    map.data.add({
                        geometry: new maps.Data.LineString(locations)
                    })
                }
                }
            >
                {
                    locations.map((loc, idx) => {
                        return (
                            <LocationPin
                            lat={loc.lat}
                            lng={loc.lng}
                            text={(idx+1) + ""}
                        />
                        );
                    })
                }
               
            </GoogleMapReact>
        </div>
    );
}

const test_locs = [{ lat: 30, lng: 40, alt: 1, date: new Date() }, { lat: 30.1, lng: 40.3, alt: 2, date: new Date() }, { lat: 30.2, lng: 40.2, alt: 2, date: new Date() }, { lat: 29.3, lng: 40.3, alt: 2, date: new Date() }];
const History = (props) => (
    <div className="map-wrap">
        <LocationList
            setPage={props.setPage}
            dev={{name: "Device 1"}} 
            locs={test_locs}/>
        <Map locations={test_locs} zoomLevel={17} />
    </div>
)


export default History;