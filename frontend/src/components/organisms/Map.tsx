import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export const Map = (props) => {
    const center = [35.681236, 139.767125]; // 東京駅
    const zoom = 13;
    const { stations } = props
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: "500px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            {stations.map((station) => (
                <Marker
                    key={station["owl:sameAs"]}
                    position={[station["geo:lat"], station["geo:long"]]}
                    eventHandlers={{
                        click: () => props.handleClick(station),
                    }}
                >
                    <Popup>{station["dc:title"]}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};
