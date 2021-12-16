import "./DeviceList.css"
import Button from '@mui/material/Button';
import Spinner from '@mui/material/CircularProgress';

function formatCoordinates(coord) {
    return `${coord.lat}, ${coord.lng}`;
}

const DeviceRow = ({ device, setPage, setDev }) => {

    return (
        <div className="device-row" key={device.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p className="device-row-header">Device {device.id}</p>
                <p className="device-row-imei">{device.imei}</p>
            </div>
            <div className="device-row-body-wrap">
                <div className="device-row-body">
                    <p>Location: {formatCoordinates(device)}</p>
                    <p>Altitude: {device.alt} m</p>
                </div>
                <div style={{ flex: 0.2, justifyContent: "center", display: "flex", alignItems: "center" }}>
                    <Button variant="contained" size="small"
                        onClick={() => {
                            setDev(device);
                            setPage("History");
                        }}>
                        HISTORY
                    </Button>
                </div>
            </div>
        </div>
    );
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

const DeviceList = ({ setPage, setDev, devices, error }) => {
    return (
        <div className="device-list">
            {
                devices == null ? <NotReadyElm error={error}/> : (
                    <div className="device-list-inner-wrap">
                        {devices.map((dev, idx) => <DeviceRow key={idx+""} device={dev} setPage={setPage} setDev={setDev} />)}
                    </div>
                )
            }
        </div>
    )
}

export default DeviceList;