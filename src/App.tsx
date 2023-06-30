import { useLoadScript } from "@react-google-maps/api";
import React, { useState } from "react";
import { Map } from "./components/Map";
import { INITIAL_MARKERS, drivers } from "./constants";
import "./App.css";

const App = () => {
  const [markers, setMarkers] = useState(INITIAL_MARKERS);

  const { isLoaded } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });

  return (
    <div className="main-container">
      {isLoaded ? <Map markers={markers} setMarkers={setMarkers} /> : <p>Loading...</p>}

      <ul className="drivers-list">
        {React.Children.toArray(
          drivers.map(({ id, name, color }) => (
            <li style={{ backgroundColor: color }}>
              <p>#{id}</p>
              <h1>{name}</h1>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default App;
