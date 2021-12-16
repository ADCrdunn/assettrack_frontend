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

import DeviceList from "./DeviceList";
import History from "./History";

const location = {
    address: 'Device 1',
    lat: 37.42216,
    lng: -122.08427,
} // our location object from earlier

const LocationPin = ({ text }) => (
    <div className="pin">
        <PinIcon icon={locationIcon} className="pin-icon" />
        <p className="pin-text">{text}</p>
    </div>
)

const Map = ({ location, zoomLevel }) => {
    const [map, setMap] = React.useState();
    const [maps, setMaps] = React.useState();
    const [isLoaded, setIsMapLoaded] = React.useState();

    return (
        <div className="google-map" style={{ height: "85vh" }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyC7PwKGD84I44L1GdZYO7mCwgeFaiWsEQI' }}
                defaultCenter={location}
                defaultZoom={zoomLevel}
            >
                <LocationPin
                    lat={location.lat}
                    lng={location.lng}
                    text={location.address}
                />
                <LocationPin
                    lat={37.2}
                    lng={-122.3}
                    text={"Device 2"}
                />
            </GoogleMapReact>
        </div>
    );
}

const MapWrap = (props) => {
    return (
        <div className="map-wrap">
            <DeviceList 
                devices={[{ name: "Device 1" }, { name: "Device 2" }]}
                {...props}
            />
            <Map location={location} zoomLevel={17} />
        </div>
    );
}

const App = () => {
    const [page, setPage] = React.useState("DeviceList");
    const [currDev, setCurrDev] = React.useState();

    return (<div className="App">
        <div className="header-bar" style={{zIndex: 100}}>
            <h2 className="map-h2">Asset Tracker</h2>
        </div>
        {
            page == "DeviceList" ? <MapWrap setPage={setPage} setDev={setCurrDev}/> : <History device={currDev} setPage={setPage} setDev={setCurrDev}/>
        }
    </div>);
}


export default App;