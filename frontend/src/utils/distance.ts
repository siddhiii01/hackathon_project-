import type { Location } from "../../types/emergency";


const toRadians = (degrees: number) => (degrees * Math.PI) /180;

export const calculateRadialDistanceBetweenCoordinates = (
    sourceCoordinates: Location,
    destinationCoordinates: Location
    ) =>
    {
    const EARTH_RADIUS_IN_KM = 6371;
    const sourceLatitudeInRadians = toRadians(sourceCoordinates.lat);
    const destinationLatitudeInRadians = toRadians(destinationCoordinates.lat);

    const latitudeDifference = toRadians(destinationCoordinates.lat - sourceCoordinates.lat);
    const longitudeDifference = toRadians(destinationCoordinates.lng - sourceCoordinates.lng);
    const haversineOfCentralAngle = Math.pow(Math.sin(latitudeDifference / 2), 2) +
                                            Math.cos(sourceLatitudeInRadians) *
                                            Math.cos(destinationLatitudeInRadians) *
                                            Math.pow(Math.sin(longitudeDifference / 2), 2);
                                            const centralAngle = 2 * Math.atan2(
                                            Math.sqrt(haversineOfCentralAngle),
                                            Math.sqrt(1 - haversineOfCentralAngle)
                                    );

    //here Distance is Calulated in KiloMeters                                
    const distanceInKm = EARTH_RADIUS_IN_KM * centralAngle;
    return distanceInKm;
    
};


