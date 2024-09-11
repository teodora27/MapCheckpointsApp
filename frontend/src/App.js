import * as React from 'react';
import { useState } from 'react';
import Map, {Popup} from 'react-map-gl';
import {Marker} from 'react-map-gl';
import {Room} from "@material-ui/icons";
import "./App.css";

function App() {
  const [viewport, setViewport] = useState({
    latitude: 47,
    longitude: 2,
    zoom: 4,
  });
  return (
    <div className="App"style={{ width: '100vw', height: '100vh'}}>
      <Map
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11" 
        style={
          { 
            width: '100vw', 
            height: '100vh' 
          }
        }
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onMove={(evt) => setViewport(evt.viewState)}
        //onViewportChange={nextViewport => setViewport(nextViewport)}
      
      >
        <Marker
          latitude={47} 
          longitude={2} 
          //offset={[-3.5 * viewState.latitude,-7 * viewport.zoom]}
          anchor="bottom"
        >
          <Room style={{fontSize:viewport.zoom*6, color: "rgb(222, 49, 99)"}}/> 
        </Marker> 

        {/* <Popup 
          latitude={47}
          longitude={2} 
          offset={[2,-20]}
          anchor="left"
          // onClose={() => setShowPopup(false)}
          >
          <div className='card'>
          <label>Name</label>
            <h4 className='name'>Center of France</h4>
          <label>Description</label>
            <p className='desc'>10/10 must visit as soon as possible</p>
          <label>Information: </label>
          <span className='username'>Created by <b>Teo</b></span>
          <span className='date'> 1 hour ago</span>
          </div>
      </Popup> */}


      </Map> 
    </div>
  );
}

export default App;
