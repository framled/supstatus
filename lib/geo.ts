import { Location } from "./types";

/**
 * Calculates the Great-Circle distance between two points in kilometers
 * using the Haversine formula.
 */
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Finds the location in the provided list closest to the user's coordinates.
 */
export function findClosestLocation(userLat: number, userLon: number, locations: Location[]): Location | null {
    if (!locations.length) return null;

    let closest = locations[0];
    let minDistance = Infinity;

    for (const loc of locations) {
        const distance = getDistanceFromLatLonInKm(userLat, userLon, loc.lat, loc.lon);
        if (distance < minDistance) {
            minDistance = distance;
            closest = loc;
        }
    }

    return closest;
}
