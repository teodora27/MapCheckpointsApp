import * as React from 'react';
import { useState } from 'react';
import Map from 'react-map-gl';
import './App.css';


function App() {
  const [viewport, setViewport] = useState({
    // width: '100%',
    // height: '100%',
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  return (
    <div className="App">
      <Map
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11" 
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onMove={(evt) => setViewport(evt.viewState)}
        //onViewportChange={nextViewport => setViewport(nextViewport)}
      />
    </div>
  );
}

export default App;
