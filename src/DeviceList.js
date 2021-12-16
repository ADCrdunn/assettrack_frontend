import "./DeviceList.css"
import Button from '@mui/material/Button';

const DeviceRow = ({ device, setPage, setDev }) => {

    return (
        <div className="device-row">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p className="device-row-header">{device.name}</p>
                <p className="device-row-imei">IMEI{device.imei}</p>
            </div>
            <div className="device-row-body-wrap">
                <div className="device-row-body">
                    <p>Location: ...</p>
                    <p>Altitude: ...</p>
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

const DeviceList = ({ setPage, setDev, devices }) => {
    return (
        <div className="device-list">
            <div className="device-list-inner-wrap">
                {devices.map((dev) => <DeviceRow device={dev} setPage={setPage} setDev={setDev}/>)}
            </div>
        </div>
    )
}

export default DeviceList;