import { GoogleMap, InfoWindowF, Marker } from "@react-google-maps/api";
import React, { useState } from "react";
import { drivers } from "../../constants";
import { Driver, MarkerType } from "../../types";
import styles from "./styles.module.css";

interface MapProps {
  markers: MarkerType[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerType[]>>;
}

export default function Map({ markers, setMarkers }: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [assignedDriver, setAssignedDriver] = useState<Driver>();

  const center = { lat: -34.636829, lng: -58.400994 }; // Parque Patricios coords

  function getCustomIcon(fillColor = "grey") {
    return {
      path: "M9.375 1.953a5.286 5.286 0 0 0 -5.287 5.287 5.263 5.263 0 0 0 1.05 3.163l3.392 5.875c0.019 0.038 0.039 0.075 0.063 0.109l0.007 0.013 0.002 -0.002a0.95 0.95 0 0 0 0.776 0.396 0.941 0.941 0 0 0 0.722 -0.338l0.009 0.005 0.033 -0.058a0.965 0.965 0 0 0 0.124 -0.216l3.324 -5.756a5.263 5.263 0 0 0 1.074 -3.194 5.286 5.286 0 0 0 -5.287 -5.287zm-0.053 7.968a2.606 2.606 0 1 1 0 -5.211 2.606 2.606 0 0 1 0 5.211z",
      fillOpacity: 1,
      fillColor,
      strokeWeight: 1,
      strokeColor: "#000",
      scale: 2,
    };
  }

  const handleClickMarker = (marker: MarkerType) => setSelectedMarker(marker);

  const handleAssignDriver = () => {
    const markerToModifyIndex = markers.findIndex((marker) => marker.position === selectedMarker?.position);
    const modifiedMarkers = [...markers];

    modifiedMarkers[markerToModifyIndex].assignedDriver = assignedDriver;

    setMarkers(modifiedMarkers);
    setSelectedDriver("");
  };

  const handleChangeSelectedDriver = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assignedDriver: Driver = JSON.parse(e.target.value);

    setSelectedDriver(e.target.value);
    setAssignedDriver(assignedDriver);
  };

  return (
    <GoogleMap zoom={14} center={center} mapContainerClassName="map-container">
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          icon={getCustomIcon(marker.assignedDriver?.color)}
          onClick={() => handleClickMarker(marker)}
        />
      ))}

      {selectedMarker && (
        <InfoWindowF position={selectedMarker.position} onCloseClick={() => setSelectedMarker(null)}>
          <div className={styles["infoWindow-container"]}>
            <div className={styles["info-container"]}>
              <h1>{selectedMarker.assignedDriver ? "Assigned driver:" : "Unassigned location"}</h1>

              {selectedMarker.assignedDriver && <p className={styles.driver}>{selectedMarker.assignedDriver.name}</p>}
            </div>

            <div className={styles["assign-container"]}>
              <p>{`Select a driver to ${selectedMarker.assignedDriver ? "reassign" : "assign"} it this location:`}</p>

              <div className={styles["selection-container"]}>
                <select onChange={handleChangeSelectedDriver} value={selectedDriver}>
                  <option disabled value="">
                    Select a driver
                  </option>
                  {React.Children.toArray(
                    drivers.map((driver) => {
                      return <option value={JSON.stringify(driver)}>{driver.name}</option>;
                    })
                  )}
                </select>

                <button onClick={handleAssignDriver}>{selectedMarker.assignedDriver ? "Reassign" : "Confirm"}</button>
              </div>
            </div>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
