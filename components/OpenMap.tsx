"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, ZoomControl } from "react-leaflet";
import { Location } from "@/lib/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import clsx from "clsx";

// Custom Marker Icon to match Stitch design
const createCustomIcon = () => L.divIcon({
    className: "custom-marker",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -10]
});

interface OpenMapProps {
    location: Location | null;
    onLocationSelect: (location: Location) => void;
    className?: string;
}

function MapController({ location }: { location: Location | null }) {
    const map = useMap();

    useEffect(() => {
        if (location) {
            map.flyTo([location.lat, location.lon], 13, {
                animate: true,
                duration: 1.5
            });
        }
    }, [location, map]);

    return null;
}

function LocationMarker({ onSelect }: { onSelect: (loc: Location) => void }) {
    useMapEvents({
        click(e) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
                .then(res => res.json())
                .then(data => {
                    const name = data.address.city || data.address.town || data.address.village || "Selected Location";
                    onSelect({
                        name: name,
                        lat: e.latlng.lat,
                        lon: e.latlng.lng,
                        id: "custom-" + Date.now()
                    });
                })
                .catch(() => {
                    onSelect({
                        name: "Custom Location",
                        lat: e.latlng.lat,
                        lon: e.latlng.lng,
                        id: "custom-" + Date.now()
                    });
                });
        },
    });

    return null;
}

export default function OpenMap({ location, onLocationSelect, className }: OpenMapProps) {
    // Default center (Viña del Mar as per Stitch)
    const defaultCenter: [number, number] = location ? [location.lat, location.lon] : [-33.0245, -71.5518];

    return (
        <div className={clsx("rounded-2xl overflow-hidden shadow-2xl relative z-0", className)}>
            <MapContainer
                center={defaultCenter}
                zoom={11}
                scrollWheelZoom={false}
                zoomControl={false}
                className="w-full h-full"
                style={{ background: '#1a1a2e' }}
            >
                <ZoomControl position="bottomright" />
                {/* Dark Matter Tiles to match Stitch Deep Indigo theme */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {location && (
                    <Marker position={[location.lat, location.lon]} icon={createCustomIcon()}>
                        <Popup>
                            {location.name}
                        </Popup>
                    </Marker>
                )}

                <MapController location={location} />
                <LocationMarker onSelect={onLocationSelect} />
            </MapContainer>

            {/* Gradient Overlay for integration with the app background if needed, but handled in parent */}
        </div>
    );
}
